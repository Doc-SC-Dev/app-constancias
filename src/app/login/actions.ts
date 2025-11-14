"use server";
import { auth } from "@/lib/auth";
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

  } catch (error: any) { 
    const errorCode = error?.body?.code || ""; 

    if (errorCode === "INVALID_EMAIL_OR_PASSWORD") {
      return { success: false, message: "Contraseña o Email incorrecto" };
    }
    
    return { success: false, message: "Error en el inicio de sesión" };
  }
}

export async function registerAction(
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const name = formData.get("name")?.toString() || "";

  try {
    const res = await auth.api.signUpEmail({ body: { email, password, name } });

    if (!res?.token) {
      console.error("Registration error:", res);
      return { success: false, message: "Failed to register user" };
    }

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Exception in registerAction:", error);
    return { success: false, message: "An error occurred during registration" };
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