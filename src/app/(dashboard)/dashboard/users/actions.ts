"use server";

import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { withTryCatch } from "@/app/action";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { User, UserCreate, UserEdit } from "@/lib/types/users";

export async function updateUser(userData: UserEdit, id: string) {
  const { success, data, error } = await withTryCatch<User>(
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
  const { studentId, rut, ...newUserData } = userData;

  const password = userData.rut.replaceAll(".", "");

  const { success, data, error } = await withTryCatch<{ user: User }>(
    auth.api.createUser({
      headers: await headers(),
      body: {
        ...newUserData,
        password,
        data: {
          rut,
        },
      },
    }),
  );
  if (success) {
    if (studentId) {
      const { success, error } = await withTryCatch(
        db.student.create({
          data: {
            id: parseInt(studentId, 10),
            isRegularStudent: false,
            userId: data.user.id,
          },
        }),
      );
      if (!success) {
        return {
          success: false,
          message: error,
        };
      }
    }
    revalidatePath("/dashboard/users");
    return {
      success: true,
      message: `Usuario con nombre ${data.user.name} y rol ${data.user.role} creado exitosamente`,
    };
  } else if (error === "UNAUTHORIZED") {
    return {
      success: false,
      message: "No estas autorizado para crear usuarios",
    };
  }
  return {
    success: false,
    message: "Algo salio mal al intentar crear el usuario",
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
