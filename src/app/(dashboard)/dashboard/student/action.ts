"use server";

import { withTryCatch } from "@/app/action";
import type { Student as DbStudent } from "@/generated/prisma";
import { db } from "@/lib/db";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import type { Student } from "@/lib/types/students";

export const listStudents = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<Student>> => {
  const [total, students] = await db.$transaction([
    db.student.count(),
    db.student.findMany({
      take: PAGE_SIZE,
      skip: pageParam * PAGE_SIZE,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);
  return {
    data: students.map((student) => ({
      id: student.id,
      studentId: student.studentId,
      name: student.user.name,
      email: student.user.email,
      isRegular: student.isRegularStudent,
      admissionDate: student.admisionDate.getFullYear(),
    })),
    nextPage: pageParam + 1,
    totalRows: total,
  };
};

export const updateRegularStudent = async ({
  studentId,
  isRegular,
}: {
  studentId: number;
  isRegular: boolean;
}) => {
  const { success, error } = await withTryCatch<DbStudent>(
    db.student.update({
      where: {
        studentId,
      },
      data: {
        isRegularStudent: isRegular,
      },
    }),
  );

  return {
    success,
    message: error,
  };
};
