"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const logoutAction = async () => {
  console.log("on logout");
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};
