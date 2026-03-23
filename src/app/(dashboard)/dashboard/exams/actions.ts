"use server";

import { revalidatePath } from "next/cache";

import type { Role } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";

export type Exams = {
  id: string;
  activityName: string;
  activityType: string;
  userName: string;
  startAt: string;
  endAt?: string;
  grade: number | null;
  studentId: string | null;
  studentName: string | null;
  studentRut: string | null;
};

export async function listExams({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<Exams>> {
  const session = await isAuthenticated();
  const start = pageParam * PAGE_SIZE;

  const [count, data] = await db.$transaction([
    db.activity.count({
      where: isAdmin(session.user.role as Role)
        ? { activityType: { name: { contains: "Examen", mode: "insensitive" } } }
        : {
          activityType: { name: { contains: "Examen", mode: "insensitive" } },
          participants: {
            some: {
              userId: {
                equals: session.user.id,
              },
            },
          },
        },
    }),
    db.activity.findMany({
      where: isAdmin(session.user.role as Role)
        ? { activityType: { name: { contains: "Examen", mode: "insensitive" } } }
        : {
          activityType: { name: { contains: "Examen", mode: "insensitive" } },
          participants: {
            some: {
              userId: {
                equals: session.user.id,
              },
            },
          },
        },
      take: PAGE_SIZE,
      skip: start,
      include: {
        activityType: {
          select: {
            name: true,
          },
        },
        exams: true,
        participants: {
          include: {
            user: {
              select: {
                name: true,
                role: true,
                rut: true,
                student: {
                  select: { id: true, studentId: true }
                }
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    data: data.map<Exams>((activity) => {
      const studentParticipant = activity.participants.find((p) => p.user.role === "STUDENT");
      const examRecord = studentParticipant?.user.student?.id
        ? activity.exams.find((e) => e.studentId === studentParticipant.user.student?.id)
        : null;

      return {
        id: activity.id,
        activityName: activity.name,
        activityType: activity.activityType.name,
        startAt: activity.startAt.toISOString(),
        endAt: activity.endAt ? activity.endAt.toISOString() : undefined,
        userName: activity.participants.find((p) => p.user.role === "PROFESSOR")?.user.name || activity.participants[0]?.user.name || "Sin asignar",
        grade: examRecord?.grade ?? null,
        studentId: studentParticipant?.user.student?.id ?? null,
        studentName: studentParticipant?.user.name ?? null,
        studentRut: studentParticipant?.user.rut ?? null,
      };
    }),
    nextPage: pageParam + 1,
    totalRows: count,
  };
}

export async function updateExamGrade({
  activityId,
  studentId,
  grade,
}: {
  activityId: string;
  studentId: string;
  grade: number;
}) {
  const session = await isAuthenticated();

  if (!isAdmin(session.user.role as Role) && session.user.role !== "PROFESSOR") {
    return { error: "No tienes permiso para editar notas." };
  }

  try {
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      select: { startAt: true },
    });

    if (activity) {
      const editableFrom = new Date(activity.startAt);
      editableFrom.setDate(editableFrom.getDate() + 1);
      editableFrom.setHours(0, 0, 0, 0);

      if (new Date() < editableFrom) {
        return {
          error:
            "Las notas solo se pueden ingresar a partir del día siguiente al examen.",
        };
      }
    }

    const existing = await db.exam.findFirst({
      where: {
        activityId,
        studentId,
      },
    });

    if (
      existing &&
      existing.grade >= 4.0 &&
      !isAdmin(session.user.role as Role)
    ) {
      return {
        error: "No puedes editar un examen que está aprobado.",
      };
    }

    if (existing) {
      await db.exam.update({
        where: { id: existing.id },
        data: { grade },
      });
    } else {
      await db.exam.create({
        data: {
          id: crypto.randomUUID(),
          activityId,
          studentId,
          grade,
        },
      });
    }

    revalidatePath("/dashboard/exams");
    return { success: true };
  } catch (error) {
    console.error("Error updating exam grade:", error);
    return { error: "Ocurrió un error guardando la nota." };
  }
}
