"use client";
import { DataTable } from "@/components/data-table";
import { listUserActivities } from "../../actions";
import { columns } from "./user-activity-columns";

type UserActivitiesTableProps = {
  userId: string;
};

export default function UserActivitiesTable({
  userId,
}: UserActivitiesTableProps) {
  return (
    <DataTable
      size="sm"
      columns={columns}
      queryFn={({ pageParam }) => listUserActivities({ pageParam, userId })}
      queryKey="list-user-activity"
      placeholder="Filtrar por actividad..."
      emptyTitle="No hay actividades"
      emptyDescription="El usuario no tiene ninguna actividad registrada"
    >
      {""}
    </DataTable>
  );
}
