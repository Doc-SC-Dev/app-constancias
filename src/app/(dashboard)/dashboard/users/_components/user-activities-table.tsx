import { DataTable } from "@/components/data-table";
import type { UserWithActivities } from "@/lib/types/users";
import { columns } from "./user-activities-columns";

type UserActivitiesTableProps = {
  participants: UserWithActivities["participants"];
};

export default function UserActivitiesTable({
  participants,
}: UserActivitiesTableProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        No hay actividades registradas.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={participants}
        placeholder="Filtrar por actividad..."
        title="Actividades"
      >
        <></>
      </DataTable>
    </div>
  );
}
