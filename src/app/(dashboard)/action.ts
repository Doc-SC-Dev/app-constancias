"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
