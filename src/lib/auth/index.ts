import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { withTryCatch } from "@/app/action";
import type { Session } from "../types/users";
import { auth } from "./better-auth";

const isAuthenticated = cache(async () => {
  const { success, data: session } = await withTryCatch<Session | null>(
    auth.api.getSession({
      headers: await headers(),
    }),
  );
  if (!success) {
    redirect("/login");
  }
  if (!session) {
    redirect("/login");
  }
  return session;
});

const hasPermission = cache(async (permissions: Record<string, string[]>) => {
  const { user } = await isAuthenticated();
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      userId: user.id,
      permissions: permissions,
    },
  });
  return { user, success };
});

const hasPermissionOrRedirect = cache(
  async (permissions: Record<string, string[]>) => {
    const { user } = await isAuthenticated();
    const { success } = await auth.api.userHasPermission({
      headers: await headers(),
      body: {
        userId: user.id,
        permissions: permissions,
      },
    });
    if (!success) {
      redirect("/dashboard");
    }
    return success;
  },
);

export { isAuthenticated, auth, hasPermission, hasPermissionOrRedirect };
