import { HistoryClient } from "./_components/history-client";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { HistoryEntry } from "@/lib/types/history";
import { HistoryEmpty } from "./_components/history-empty";

export default async function HistoryPage() {
  const nextHeader = await headers();
  const session = await auth.api.getSession({
    headers: nextHeader,
  });

  if (!session) {
    redirect("/login");
  }

  const { success } = await auth.api.userHasPermission({
    headers: nextHeader,
    body: {
      permissions: {
        request: ["list"],
      },
    },
  });

  if (!success) {
    return redirect("/dashboard");
  }

  const userRole = session.user.role || "guest";
  const isAdmin = userRole === "administrator" || userRole === "superadmin";

  const requests = await db.request.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: {
      user: true,
      certificate: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const historyData: HistoryEntry[] = requests.map((request) => ({
    id: request.id,
    name: request.user.name,
    rut: request.user.rut,
    role:
      (request.user.role as
        | "administrator"
        | "professor"
        | "student"
        | "superadmin"
        | "guest") || "guest",
    certName: request.certificate.name,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }));

  if (!historyData.length) {
    return <HistoryEmpty />;
  }

  return (
    <div className="container mx-auto">
      <HistoryClient data={historyData} userRole={userRole} />
    </div>
  );
}
