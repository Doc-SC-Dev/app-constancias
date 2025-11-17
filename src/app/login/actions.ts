"use server";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { cookies } from "next/headers";

interface ActionResponse {
  success: boolean;
  message: string;
}

export async function loginAction(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    const res = await auth.api.signInEmail({ body: { email, password } });

    if (!res?.token) {
       return { success: false, message: "Error en el inicio de sesión" };
    }

    await setSessionCookie(res.token);
    return { success: true, message: "Inicio de sesion exitoso" };

  } catch (error) { 

    if (error instanceof APIError){
      console.error(error )
      if (error.status === "UNAUTHORIZED"){
        return { success: false, message: "Correo o contraseña incorrecta" };
      }
    }
    if (error instanceof PrismaClientKnownRequestError){
      console.error(error)
      if (error.code === 'P5010'){
        return {success: false, message: "Sin conexión a internet"};
      }
    }
    return { success: false, message: "Error en el inicio de sesión" };
  }
}


async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

