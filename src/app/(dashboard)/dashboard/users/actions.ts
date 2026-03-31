"use server";

import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { withTryCatch } from "@/app/action";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin, Roles } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import type { UserActivityDTO } from "@/lib/types/paricipant-activity";
import type { UserRequest } from "@/lib/types/request";
import type {
  User,
  UserCreate,
  UserEdit,
  UserSelect,
  UserWithAcademicDegree,
} from "@/lib/types/users";

export async function updateUser(userData: UserEdit) {
  const { success, data, error } = await withTryCatch<UserSelect>(
    auth.api.adminUpdateUser({
      headers: await headers(),
      body: {
        userId: userData.id,
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
      message: "No estás autorizado para actualizar usuarios",
    };
  }
  return {
    success: false,
    message: "Algo salió mal al intentar actualizar el usuario",
  };
}

export async function createUser(userData: UserCreate) {
  const { studentId, rut, academicGrade, gender, role, ...newUserData } =
    userData;

  const password = userData.rut.replaceAll(".", "");
  const { success, data, error } = await withTryCatch<UserSelect>(
    db.$transaction<UserSelect>(async (tx) => {
      // try to create user
      const session = await auth.api.createUser({
        headers: await headers(),
        body: {
          ...newUserData,
          role,
          password,
          data: {
            gender,
            rut,
            acadmicDegreeId: academicGrade,
          },
        },
      });
      if (!session) throw new Error("El usuario ya existe");

      if (session.user.role === Roles.STUDENT && studentId) {
        const student = await tx.student.create({
          data: {
            studentId: studentId,
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
          message: "No estás autorizado para eliminar usuarios",
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
  const { user } = await isAuthenticated();

  try {
    const [count, users] = await db.$transaction([
      db.user.count({
        where: {
          id: {
            not: user.id,
          },
        },
      }),
      db.user.findMany({
        where: {
          id: {
            not: user.id,
          },
        },
        take: PAGE_SIZE,
        skip: pageParam * PAGE_SIZE,
        orderBy: [{ createdAt: "desc" }],
      }),
    ]);

    // Convertimos los objetos nativos de Prisma a objetos planos para evitar
    // errores de serialización "Only plain objects can be passed..." en Next.js
    const safeUsers = JSON.parse(JSON.stringify(users));

    return {
      data: safeUsers as User[],
      nextPage: users.length === PAGE_SIZE ? pageParam + 1 : undefined,
      totalRows: count,
    };
  } catch (error) {
    console.error("Error fetching listUsers:", error);
    return { data: [], nextPage: undefined, totalRows: 0 };
  }
}

export async function listUsersAdmin(): Promise<User[]> {
  const session = await isAuthenticated();
  const users = await db.user.findMany({
    where: {
      id: {
        not: session.user.id,
      },
      role: {
        notIn: [Roles.ADMIN, Roles.SUPERADMIN],
      },
    },
  });
  return users as User[];
}

export const listUserActivities = async ({
  pageParam,
  userId,
}: {
  pageParam: number;
  userId: string;
}): Promise<PaginationResponse<UserActivityDTO>> => {
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
        type: {
          select: {
            name: true,
            id: true,
          },
        },
        activity: {
          select: {
            id: true,
            name: true,
            activityType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);
  const participants = data.map<UserActivityDTO>((participant) => ({
    activityId: participant.activity.id,
    hours: participant.hours,
    activityName: participant.activity.name,
    activityType: participant.activity.activityType.name,
    typeId: participant.type.id,
    typeName: participant.type.name,
  }));
  return {
    data: participants,
    nextPage: participants.length === PAGE_SIZE ? pageParam + 1 : undefined,
    totalRows: count,
  };
};

export async function getUserById(id: string): Promise<UserWithAcademicDegree> {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      academicDegree: {
        select: {
          name: true,
        },
      },
      gender: true,
      rut: true,
      banned: true,
    },
  });
  if (!user) throw new Error("Usuario no encontrado");
  return user as UserWithAcademicDegree;
}

export async function listUserRequest({
  pageParam,
  userId,
}: {
  pageParam: number;
  userId: string;
}): Promise<PaginationResponse<UserRequest>> {
  const [count, data] = await db.$transaction([
    db.request.count({ where: { userId } }),
    db.request.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        state: true,
        createdAt: true,
        certificate: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);
  return {
    data: data.map((request) => ({
      id: request.id,
      name: request.certificate.name,
      createdAt: request.createdAt,
      state: request.state,
    })),
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
    totalRows: count,
  };
}

export const userStateChange = async (id: string, banned: boolean) => {
  const { user } = await isAuthenticated();
  if (!isAdmin((user.role ?? Roles.STUDENT) as Roles))
    throw new Error("No estás autorizado para realizar esta acción");
  const auxHeaders = await headers();
  if (!banned) {
    await auth.api.banUser({
      headers: auxHeaders,
      body: {
        userId: id,
      },
    });
  } else {
    await auth.api.unbanUser({
      headers: auxHeaders,
      body: {
        userId: id,
      },
    });
  }
  revalidatePath(`/dashboard/users`);
  revalidatePath(`/dashboard/users/${id}`);

  return !banned;
};
