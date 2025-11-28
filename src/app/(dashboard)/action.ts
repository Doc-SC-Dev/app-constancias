"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CreateRequest, Request } from "@/lib/types/request";
import type { Session } from "@/lib/types/users";
import { withTryCatch } from "../action";

export const logoutAction = async () => {
  console.log("on logout");
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export const getRequestsTypes = async () => {
  return await db.certificate.findMany({
    select: {
      name: true,
      id: true,
    },
  });
};

export const createRequest = async (data: CreateRequest) => {
  const { data: session } = await withTryCatch<Session | null>(
    auth.api.getSession({
      headers: await headers(),
    }),
  );
  if (!session) {
    redirect("/login");
    return { success: false, message: "No estas autenticado" };
  }
  const { user } = session;
  const {
    success,
    error,
    data: request,
  } = await withTryCatch<Request>(
    db.request.create({
      data: {
        userId: user.id,
        certificateId: data.certificateId,
        state: "READY",
      },
    }),
  );
  if (!success) return { success: false, message: error };
  revalidatePath("/dashboard/history");
  return {
    success: true,
    message: `Solicitud creada exitosamente con id ${request.id}`,
  };
};
