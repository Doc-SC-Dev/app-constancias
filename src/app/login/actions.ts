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
      console.error("Login error:", res);
      return {
        success: false,
        message: "Invalid credentials or authentication failed",
      };
    }

    await setSessionCookie(res.token);
    console.log("Login successful");
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Exception in loginAction:", error);
    return { success: false, message: "An error occurred during login" };
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
