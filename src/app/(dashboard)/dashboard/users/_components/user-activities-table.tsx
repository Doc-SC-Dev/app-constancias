import { DataTable } from "@/components/data-table";
import { columns } from "./user-activities-columns";
import { listParticipantActivities } from "../actions";

type UserActivitiesTableProps = {
  userId: string
};

export default function UserActivitiesTable({
  userId,
}: UserActivitiesTableProps) {

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Actividades</h3>
      <DataTable
        emptyTitle="No hay actividades"
        emptyDescription="No hay actividades disponibles"
        buttonLabel="Agregar actividad"
        onDialog
        columns={columns}
        queryFn={({ pageParam }) => listParticipantActivities({ pageParam, userId })}
        queryKey="list-user-activity"
        placeholder="Filtrar por actividad..."
      >
        <></>
      </DataTable>
    </div>
  );
}
