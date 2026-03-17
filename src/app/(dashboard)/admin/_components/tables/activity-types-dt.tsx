"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LazyDataTable } from "@/components/dynamic-table";
import { TableCell } from "@/components/table-cell";
import type { ActivityType } from "@/lib/types/activity";
import { formatDate } from "@/lib/utils";
import { getActivityTypesPaginated } from "../../actions";
import CreateActivityTypeDialog from "../dialogs/create-acitivty-type-dialog";

const columns: ColumnDef<ActivityType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "nParticipantsTypes",
    header: () => (
      <TableCell className="justify-center">Tipo de participantes</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<string>()}</TableCell>
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
];
export default function ActivityTypesDT() {
  return (
    <LazyDataTable
      columns={columns}
      queryFn={getActivityTypesPaginated}
      queryKey="get-paginated-activity-types"
      placeholder="Filtrar tipos de actividades"
      emptyTitle="No se han creado tipos de actividades"
      emptyDescription="Para visualizar tipos de actividades empiece creando su primer tipo de actividad"
      createDialog={CreateActivityTypeDialog}
    />
  );
}
