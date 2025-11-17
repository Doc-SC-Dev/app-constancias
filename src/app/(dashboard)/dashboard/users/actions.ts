"use server";

import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserCreate, UserEdit } from "@/lib/types/users";

export async function updateUser(userData: UserEdit, id: string) {
  try {
    const data = await auth.api.adminUpdateUser({
      headers: await headers(),
      body: {
        userId: id,
        data: userData,
      },
    });
    return { data };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 405)
        return { error: "No estas autorizado para actualizar usuarios" };
      return { error: error.message };
    }
    return { error: "Algo salio mal al intentar actualizar el usuario" };
  }
}

export async function createUser(userData: UserCreate) {
  const { studentId, rut, ...newUserData } = userData;

  const password = userData.rut.replaceAll(".", "");
  try {
    const data = await auth.api.createUser({
      headers: await headers(),
      body: {
        ...newUserData,
        password,
        data: {
          rut,
        },
      },
    });
    if (studentId) {
      await db.student.create({
        data: {
          id: parseInt(studentId, 10),
          isRegularStudent: false,
          userId: data.user.id,
        },
      });
    }
    revalidatePath("/dashboard/users");
    return { data: data.user };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "UNAUTHORIZED")
        return { error: "No estas autorizado para crear usuarios" };
      return { error: error.status };
    }
    console.error(error);
    return { error: "Algo salio mal al intentar crear el usuario" };
  }
}
