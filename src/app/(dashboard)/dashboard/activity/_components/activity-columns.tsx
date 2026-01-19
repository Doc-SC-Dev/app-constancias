"use client";

import type { ColumnDef } from "@tanstack/react-table";
import LinkActionButton from "@/components/link-action-button";
import type { ActivityDTO } from "@/lib/types/activity";
import DeleteDialog from "./delete-dialog";

export const columns: ColumnDef<ActivityDTO>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "activityType",
    header: "Tipo",
    cell({ row }) {
      const type = row.original.activityType;
      return (
        <span className="w-full">{type.replace(/_/g, " ").toLowerCase()}</span>
      );
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
        <span className="flex flex-1 justify-center">
          {to
            ? from +
              " - " +
              new Date(to).toLocaleDateString("es-CL").replaceAll("-", "/")
            : from}
        </span>
      );
    },
  },

  {
    accessorKey: "nParticipants",
    header: () => (
      <span className="flex flex-1 justify-center">
        Cantidad de participantes
      </span>
    ),
    cell({ row }) {
      const participants = row.getValue("nParticipants") as number;
      return <span className="flex flex-1 justify-center">{participants}</span>;
    },
  },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <LinkActionButton<ActivityDTO>
          seeLink={`/dashboard/activity/${activity.id}`}
          editLink={`/dashboard/activity/${activity.id}/edit`}
          deleteDialog={DeleteDialog}
          data={activity}
        />
      );
    },
  },
];
