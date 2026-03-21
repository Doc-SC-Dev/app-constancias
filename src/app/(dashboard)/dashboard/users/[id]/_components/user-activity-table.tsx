"use client";
import { LazyDataTable } from "@/components/dynamic-table";
import { listUserActivities } from "../../actions";
import { columns } from "./user-activity-columns";

type UserActivitiesTableProps = {
  userId: string;
};

export default function UserActivitiesTable({
  userId,
}: UserActivitiesTableProps) {
  return (
    <LazyDataTable
      columns={columns}
      queryFn={({ pageParam }) => listUserActivities({ pageParam, userId })}
      queryKey="list-user-activity"
      placeholder="Filtrar por actividad..."
      emptyTitle="No hay actividades"
      emptyDescription="El usuario no tiene ninguna actividad registrada"
      containerClassName="flex-1"
    />
  );
}
