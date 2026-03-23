import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";

export default async function AdminPage() {
  const { user } = await isAuthenticated();
  if (!isAdmin(user.role as Role)) redirect("/dashboard");
  redirect("/admin/general");
}
