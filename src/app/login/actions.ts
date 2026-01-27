"use server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import type { ForgotPassword } from "@/lib/types/login";
import type { LoginData } from "./loginSchema";

const emailClient = new Resend(env.RESEND_API_KEY);

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
    console.error(error);
    return { success: false, message: "Error en el inicio de sesión" };
  }
}

export async function sendEmail(email: string, BodyReact: ReactNode) {
  try {
    const res = await emailClient.emails.send({
      from: `Constancias Doctorado <${env.FROM_EMAIL}>`,
      to: email,
      subject: "Recuperar contraseña",
      react: BodyReact,
    });
    if (res.data)
      return { success: true, message: "Correo enviado exitosamente" };
    if (res.error) return { success: false, message: res.error.message };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error en el envio del correo" };
  }
}

export async function forgotPassword({
  email,
}: ForgotPassword): Promise<ActionResponse> {
  try {
    const data = await auth.api.requestPasswordReset({
      headers: await headers(),
      body: {
        email,
        redirectTo: "/login/reset-password",
      },
    });
    if (!data.status) return { success: false, message: data.message };
    return { success: true, message: "Correo enviado exitosamente" };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "UNAUTHORIZED")
        return {
          success: false,
          message:
            "No estas autorizado para solicitar un restablecimiento de contraseña",
        };
      return { success: false, message: error.status as string };
    }
    return {
      success: false,
      message:
        "Algo salio mal al intentar solicitar un restablecimiento de contraseña",
    };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ActionResponse> {
  try {
    const data = await auth.api.resetPassword({
      headers: await headers(),
      body: {
        token,
        newPassword,
      },
    });
    if (!data.status)
      return { success: false, message: "Error al restablecer la contraseña" };
    return { success: true, message: "Restablecimiento de contraseña exitoso" };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === "UNAUTHORIZED")
        return {
          success: false,
          message: "No estas autorizado para restablecer la contraseña",
        };
      return { success: false, message: error.status as string };
    }
    return {
      success: false,
      message: "Algo salio mal al intentar restablecer la contraseña",
    };
  }
}
