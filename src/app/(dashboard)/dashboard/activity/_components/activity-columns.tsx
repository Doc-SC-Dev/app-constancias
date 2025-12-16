"use client";

import type { ColumnDef } from "@tanstack/react-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { ActivityDTO } from "@/lib/types/activity";

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
      const type = row.getValue("activityType") as string;
      return <span>{type.replace(/_/g, " ").toLowerCase()}</span>;
    },
  },
  {
    accessorKey: "startAt",
    header: () => (
      <span className="flex flex-1 justify-center">Fecha de inicio</span>
    ),
    cell({ row }) {
      const date = new Date(row.original.startAt);
      return (
        <span className="flex flex-1 justify-center">
          {date.toLocaleDateString("es-CL")}
        </span>
      );
    },
  },
  {
    accessorKey: "endAt",
    header: () => (
      <span className="flex flex-1 justify-center">Fecha de finalización</span>
    ),
    cell({ row }) {
      const date = new Date(row.original.endAt);
      return (
        <span className="flex flex-1 justify-center">
          {date.toLocaleDateString("es-CL")}
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
        <ActionDialogManager<ActivityDTO>
          data={activity}
          // viewDialog={}
          // editDialog={}
          // deleteDialog={}
        />
      );
    },
  },
];
