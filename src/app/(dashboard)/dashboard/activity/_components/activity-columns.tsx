"use client";

import type { ColumnDef } from "@tanstack/react-table";
import LinkActionButton from "@/components/link-action-button";
import { TableCell } from "@/components/table-cell";
import type { ActivityDTO } from "@/lib/types/activity";
import { formatTitle } from "@/lib/utils";
import DeleteDialog from "./delete-dialog";

export const columns: ColumnDef<ActivityDTO>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell({ getValue }) {
      return <TableCell>{formatTitle(getValue<string>())}</TableCell>;
    },
  },
  {
    accessorKey: "activityType",
    header: "Tipo",
    cell({ getValue }) {
      return <TableCell>{formatTitle(getValue<string>())}</TableCell>;
    },
  },
  {
    id: "dates",
    header: () => <span className="flex flex-1 justify-center">Fechas</span>,
    cell({ row }) {
      const from = new Date(row.original.startAt)
        .toLocaleDateString("es-CL")
        .replaceAll("-", "/");
      const to = row.original.endAt;

      return (
        <TableCell className="justify-center">
          {to
            ? from +
              " - " +
              new Date(to).toLocaleDateString("es-CL").replaceAll("-", "/")
            : from}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "nParticipants",
    header: () => (
      <TableCell className="justify-center">
        Cantidad de participantes
      </TableCell>
    ),
    cell({ getValue }) {
      return (
        <TableCell className="justify-center">{getValue<number>()}</TableCell>
      );
    },
  },
  {
    id: "actions",
    header: () => <TableCell className="justify-center">Acción</TableCell>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <TableCell className="justify-center">
          <LinkActionButton<ActivityDTO>
            seeLink={`/dashboard/activity/${activity.id}`}
            editLink={`/dashboard/activity/${activity.id}/edit`}
            deleteDialog={DeleteDialog}
            data={activity}
          />
        </TableCell>
      );
    },
  },
];
