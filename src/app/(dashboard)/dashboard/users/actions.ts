"use server";

import { APIError } from "better-auth";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { UserEdit } from "@/lib/types/users";

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
