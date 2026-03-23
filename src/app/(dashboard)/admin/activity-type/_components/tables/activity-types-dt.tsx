"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { LazyDataTable } from "@/components/dynamic-table";
import { TableCell } from "@/components/table-cell";
import type { ActivityType } from "@/features/activity-type/domain/ActivityType";
import {
  deleteActivityTypeAction,
  getPaginatedActivityTypesAction,
} from "@/features/activity-type/presentation/actions";
import CreateActivityTypeDialog from "@/features/activity-type/presentation/components/create-activity-type-dialog";
import DeleteActionButton from "@/features/shared/presentation/delete-action-button";
import ViewActionButton from "@/features/shared/presentation/view-action-button";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<ActivityType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "_count.participantTypes",
    header: () => (
      <TableCell className="justify-center">Tipo de participantes</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<number>()}</TableCell>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <TableCell className="justify-center">Fecha de creación</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">
        {formatDate(getValue<Date>())}
      </TableCell>
    ),
  },
  {
    header: () => <TableCell className="justify-center">Acciones</TableCell>,
    id: "actions",
    cell: ({ row }) => {
      const activityType = row.original;
      return (
        <TableCell className="justify-center">
          <ViewActionButton url={`/admin/activity-type/${activityType.id}`} />
          <DeleteActionButton
            onClick={async () => {
              const { isSuccess, error } = await deleteActivityTypeAction(
                activityType.id,
              );
              if (!isSuccess)
                toast.error(
                  "Ha ocurrido un error al eliminar el tipo de actividad",
                  {
                    description: error,
                  },
                );
              else
                toast.success(
                  "El registro ha sido eliminado correctamente del sistema.",
                  {
                    description: `El tipo de actividad ${activityType.name.length > 25 ? `${activityType.name.slice(0, 25)}...` : activityType.name} ha sido eliminado correctamente`,
                  },
                );
            }}
            description={`¿Estás seguro de que quieres eliminar el tipo de actividad ${activityType.name.length > 25 ? `${activityType.name.slice(0, 25)}...` : activityType.name}?`}
          />
        </TableCell>
      );
    },
  },
];

export default function ActivityTypesDT() {
  return (
    <LazyDataTable
      columns={columns}
      queryFn={getPaginatedActivityTypesAction}
      queryKey="get-paginated-activity-types"
      placeholder="Filtrar tipos de actividades"
      emptyTitle="No se han creado tipos de actividades"
      emptyDescription="Para visualizar tipos de actividades empiece creando su primer tipo de actividad"
      createDialog={CreateActivityTypeDialog}
      containerClassName="h-fit max-h-full"
    />
  );
}
