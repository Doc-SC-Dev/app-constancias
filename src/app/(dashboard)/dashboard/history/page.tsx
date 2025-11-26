import { HistoryClient } from "./_components/history-client";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { HistoryEntry } from "@/lib/types/history";
import { UsersEmpty } from "../users/_components/users-empty";

export default async function HistoryPage() {
  const nextHeader = await headers();
  const session = await auth.api.getSession({
    headers: nextHeader,
  });

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role || "guest";
  const isAdmin = userRole === "administrator" || userRole === "superadmin";

  const users = await db.user.findMany({
    where: isAdmin ? undefined : { id: session.user.id },
    select: {
      id: true,
      name: true,
      rut: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const historyData: HistoryEntry[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    rut: user.rut,
    role:
      (user.role as
        | "administrator"
        | "professor"
        | "student"
        | "superadmin"
        | "guest") || "guest",
    certName: `Constancia de ${user.name}`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  if (!historyData.length) {
    return <UsersEmpty />;
  }

  return (
    <div className="container mx-auto">
      <HistoryClient data={historyData} userRole={userRole} />
    </div>
  );
}
