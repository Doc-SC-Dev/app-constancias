import { DataTable } from "@/components/data-table";
import type { HistoryEntry } from "@/lib/types/history";
import { columns } from "./_components/colums";
import { UsersEmpty } from "../users/_components/users-empty";
import { db } from "@/lib/db";

export default async function HistoryPage() {
  const users = await db.user.findMany({
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
      <DataTable
        columns={columns}
        data={historyData}
        placeholder="Filtrar por Nombre, Rol, RUT y Constancia"
      >
        <></>
      </DataTable>
    </div>
  );
}
