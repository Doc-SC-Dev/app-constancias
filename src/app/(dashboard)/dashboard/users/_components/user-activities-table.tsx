import { DataTable } from "@/components/data-table";
import { listUserActivities } from "../actions";
import { columns } from "./user-activities-columns";

type UserActivitiesTableProps = {
  userId: string;
};

export default function UserActivitiesTable({
  userId,
}: UserActivitiesTableProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Actividades</h3>
      <DataTable
        columns={columns}
        queryFn={({ pageParam }) => listUserActivities({ pageParam, userId })}
        queryKey="list-user-activity"
        placeholder="Filtrar por actividad..."
        emptyTitle="No hay actividades"
        emptyDescription="El usuario no tiene ninguna actividad registrada"
      >
        {""}
      </DataTable>
    </div>
  );
}
