"use server";

import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  console.log("🟢 [SERVER] registerAction ejecutado");
  console.log("📥 Datos recibidos:", { email, name });

  try {
    const res = await auth.signUp.email({ email, password, name });
    console.log("📤 Respuesta de auth.signUp.email:", res);

    if (res.error) {
      console.error("🟥 Error al registrar:", res.error.message);
      return { success: false, message: res.error.message };
    }

    console.log("✅ Registro exitoso");
    return { success: true, message: "Usuario registrado correctamente" };
  } catch (error) {
    console.error("🟥 Excepción en registerAction:", error);
    return { success: false, message: "Error al registrar el usuario" };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("🟡 [SERVER] loginAction ejecutado");
  console.log("📥 Datos recibidos:", { email });

  try {
    const res = await auth.signIn.email({ email, password });
    console.log("📤 Respuesta de auth.signIn.email:", res);

    if (res.error) {
      console.error("🟥 Error en login:", res.error.message);
      return { success: false, message: res.error.message };
    }

    const session = res.data?.session;
    if (session) {
      console.log("🔐 Guardando sesión en cookies:", session);
      const cookieStore = await cookies();
      cookieStore.set("session_token", session.token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      console.warn("⚠️ No se recibió sesión en la respuesta de login");
    }

    console.log("✅ Login exitoso");
    return { success: true, message: "Inicio de sesión exitoso" };
  } catch (error) {
    console.error("🟥 Excepción en loginAction:", error);
    return { success: false, message: "Error al iniciar sesión" };
  }
}

export async function logoutAction() {
  console.log("🔴 [SERVER] logoutAction ejecutado");
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");
    await auth.signOut();
    console.log("✅ Sesión cerrada correctamente");
    return { success: true, message: "Sesión cerrada correctamente" };
  } catch (error) {
    console.error("🟥 Error en logoutAction:", error);
    return { success: false, message: "Error al cerrar sesión" };
  }
}

export async function getSessionAction() {
  console.log("🟣 [SERVER] getSessionAction ejecutado");
  try {
    const session = await auth.getSession();
    console.log("📤 Sesión obtenida:", session);
    if (!session) {
      console.warn("⚠️ No hay sesión activa");
      return { authenticated: false, user: null };
    }
    return { authenticated: true, user: session.user };
  } catch (error) {
    console.error("🟥 Error al obtener sesión:", error);
    return { authenticated: false, user: null };
  }
}
