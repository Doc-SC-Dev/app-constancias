'use server';

import { loginSchema } from "@/lib/types";

export async function loginAction(unsafeData: typeof loginSchema.infer) {
    const data = loginSchema(unsafeData);

    if (!data) return { succes: false }
    // login 
    return { succes: true }
}