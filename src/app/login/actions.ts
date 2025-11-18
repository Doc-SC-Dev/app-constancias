"use server";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import { auth } from "@/lib/auth";
import type { LoginData } from "./loginSchema";

interface ActionResponse {
  success: boolean;
  message: string;
}

export async function loginAction(
  formData: LoginData,
): Promise<ActionResponse> {
  try {
    const res = await auth.api.signInEmail({
      body: formData,
      headers: await headers(),
    });

    if (!res?.token) {
      return { success: false, message: "Error en el inicio de sesión" };
    }

    return { success: true, message: "Inicio de sesion exitoso" };
  } catch (error) {
    if (error instanceof APIError) {
      console.error(error);
      if (error.status === "UNAUTHORIZED") {
        return { success: false, message: "Correo o contraseña incorrecta" };
      }
    }
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
      if (error.code === "P5010") {
        return { success: false, message: "Sin conexión a internet" };
      }
    }
    return { success: false, message: "Error en el inicio de sesión" };
  }
}
