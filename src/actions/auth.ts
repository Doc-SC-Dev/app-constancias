"use server";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth/auth";
import type { loginSchema } from "@/lib/types";

export async function loginAction(unsafeData: typeof loginSchema.infer): Promise<{ error: null; success: boolean; } | { error: string; success: boolean; }> {
    try {

        await auth.api.signInEmail({
            body: unsafeData
        });
        return { success: true, error: null }

    } catch (error) {
        if (error instanceof APIError) {
            return { error: error.message, success: false }
        }
        return { success: false, error: "Algo ocurrio" }
    }
}