"use server";

import { APIError } from "better-auth";
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
  console.log("en accion crear usuario");
  try {
    const data = await auth.api.createUser({
      headers: await headers(),
      body: {
        ...userData,
        password: userData.rut.replace(".", ""),
      },
    });
    if (userData.studentId) {
      await db.student.create({
        data: {
          id: parseInt(userData.studentId, 10),
          isRegularStudent: false,
          userId: data.user.id,
        },
      });
    }
    return { data: data.user };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "UNAUTHORIZED")
        return { error: "No estas autorizado para crear usuarios" };
      return { error: error.status };
    }
    return { error: "Algo salio mal al intentar crear el usuario" };
  }
}
