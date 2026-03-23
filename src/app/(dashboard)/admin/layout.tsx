import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin, type Role } from "@/lib/authorization/permissions";
import NavigationLink from "./_components/layout/navigation-links";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await isAuthenticated();
  if (!user) return redirect("/login");
  if (!isAdmin(user.role as Role)) return redirect("/");
  return (
    <div className="container max-h-full mx-auto flex flex-col">
      <NavigationLink />
      <div className="flex-1 flex flex-col min-h-0 mt-4">{children}</div>
    </div>
  );
}
