"use server";
import { APIError } from "better-auth";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";

type TryCatchReturnType<T> =
  | {
      success: true;
      error?: undefined;
      data: T;
    }
  | {
      success: false;
      error: string;
      data?: undefined;
    };

export async function withTryCatch<T>(
  fn: Promise<T>,
): Promise<TryCatchReturnType<T>> {
  try {
    const data = await fn;
    return { success: true, data };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.status as string };
    }
    if (error instanceof PrismaClientKnownRequestError) {
      // TODO: Add more specific error messages for prisma
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Algo salio mal",
    };
  }
}
