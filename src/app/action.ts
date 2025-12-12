"use server";
import { APIError } from "better-auth";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/client";

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
      if (error.code === "P2002") {
        return {
          success: false,
          error: `Ya existe en recurso ${error.meta?.target}`,
        };
      }
      if (error.code === "P1001") {
        return {
          success: false,
          error: "Sin conexión a internet",
        };
      }
      if (error.code === "P2022") {
        console.log(error.meta);
        return {
          success: false,
          error: `Recurso no encontrado ${error.meta?.target}`,
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
    console.error(error);
    return {
      success: false,
      error: "Algo salio mal",
    };
  }
}
