"use server";

import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { withTryCatch } from "@/app/action";
import { auth, isAuthenticated } from "@/lib/auth";
import { Roles } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import type { User, UserCreate, UserEdit, UserSelect } from "@/lib/types/users";
import { Participant } from "@/lib/types/paricipant-activity";

export async function updateUser(userData: UserEdit, id: string) {
  const { success, data, error } = await withTryCatch<UserSelect>(
    auth.api.adminUpdateUser({
      headers: await headers(),
      body: {
        userId: id,
        data: userData,
      },
    }),
  );
  if (success) {
    revalidatePath("/dashboard/users");
    return {
      success: true,
      message: `Usuario con nombre ${data.name} y rol ${data.role} actualizado exitosamente`,
    };
  } else if (error === "UNAUTHORIZED") {
    return {
      success: false,
      message: "No estas autorizado para actualizar usuarios",
    };
  }
  return {
    success: false,
    message: "Algo salio mal al intentar actualizar el usuario",
  };
}

export async function createUser(userData: UserCreate) {
  const { studentId, rut, academicGrade, ...newUserData } = userData;

  const password = userData.rut.replaceAll(".", "");
  const { success, data, error } = await withTryCatch<UserSelect>(
    db.$transaction<UserSelect>(async (tx) => {
      // try to create user
      const session = await auth.api.createUser({
        headers: await headers(),
        body: {
          ...newUserData,
          password,
          data: {
            rut,
            academicGrade: academicGrade ?? "",
          },
        },
      });
      if (!session) throw new Error("El usuario ya existe");
      // try to create professor (if user role === professor)
      if (session.user.role === Roles.PROFESSOR) {
        const professor = await tx.professor.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        if (!professor) throw new Error("Profesor ya existe");
      }
      // try to create student (if user role === student)
      if (session.user.role === Roles.STUDENT && studentId) {
        const student = await tx.student.create({
          data: {
            id: parseInt(studentId, 10),
            isRegularStudent: false,
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        if (!student) throw new Error("Estudiante ya existe");
      }
      return session.user;
    }),
  );

  if (success) {
    revalidatePath("/dashboard/users");
    return {
      success: true,
      message: `Usuario con nombre ${data.name} y rol ${data.role} creado exitosamente`,
    };
  }
  return {
    success: false,
    message: error,
  };
}

export async function ChangePassword({
  currentPass,
  newPass,
}: {
  currentPass: string;
  newPass: string;
}) {
  try {
    const data = await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: currentPass,
        newPassword: newPass,
      },
    });
    return {
      success: true,
      message: `Contraseña cambiada exitosamente para el usuario ${data.user.name}`,
    };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "BAD_REQUEST")
        return {
          success: false,
          message: "La contraseña actual no es correcta",
        };
      return { success: false, message: error.status };
    }
    return { success: false, message: "Error interno del servidor " };
  }
}

export async function deleteUser({ userId }: { userId: string }) {
  try {
    await auth.api.removeUser({
      headers: await headers(),
      body: {
        userId,
      },
    });
    revalidatePath("/dashboard/users");
    return {
      success: true,
      message: `Usuario con id ${userId} eliminado exitosamente`,
    };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "UNAUTHORIZED")
        return {
          success: false,
          message: "No estas autorizado para eliminar usuarios",
        };
      return { success: false, message: error.status };
    }
    return { success: false, message: "Error interno del servidor" };
  }
}

export async function listUsers({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<User>> {
  const session = await isAuthenticated();

  const { users, total } = await auth.api.listUsers({
    headers: await headers(),
    query: {
      filterField: "id",
      filterOperator: "ne",
      filterValue: session.user.id,
      limit: PAGE_SIZE,
      offset: pageParam * PAGE_SIZE,
    },
  });
  return { data: users as User[], nextPage: pageParam + 1, totalRows: total };
}

export async function listUsersAdmin(): Promise<User[]> {
  const session = await isAuthenticated();
  const users = await db.user.findMany({
    where: {
      id: {
        not: session.user.id,
      },
      role: {
        notIn: ["administrator", "superadmin"],
      },
    },
  });
  return users as User[];
}

export const listParticipantActivities = async ({
  pageParam,
  userId,
}: {
  pageParam: number;
  userId: string;

}): Promise<PaginationResponse<Participant>> => {
  const start = pageParam * PAGE_SIZE;
  const [count, data] = await db.$transaction([
    db.participant.count({ where: { userId } }),
    db.participant.findMany({
      where: { userId },
      take: PAGE_SIZE,
      skip: start,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        hours: true,
        type: true,
        activity: {
          select: {
            name: true,
            activityType: true,
          }
        }
      },
    }),
  ]);

  return { data, nextPage: pageParam + 1, totalRows: count };
};
