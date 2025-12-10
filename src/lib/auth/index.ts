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

export { isAuthenticated, auth };
