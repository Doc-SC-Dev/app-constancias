"use client";

import type { ColumnDef } from "@tanstack/react-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { ActivityType, ActivityWithUser } from "@/lib/types/activity";

export const columns: ColumnDef<ActivityWithUser>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "activityType",
    header: "Tipo",
    cell({ row }) {
      const type = row.getValue("activityType") as ActivityType;
      return <span>{type.replace(/_/g, " ").toLowerCase()}</span>;
    },
  },
  {
    accessorKey: "startAt",
    header: () => (
      <span className="flex flex-1 justify-center">Fecha de inicio</span>
    ),
    cell({ row }) {
      return (
        <span className="flex flex-1 justify-center">
          {row.original.startAt.toLocaleDateString("es-CL")}
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
      return (
        <span className="flex flex-1 justify-center">
          {row.original.endAt.toLocaleDateString("es-CL")}
        </span>
      );
    },
  },
  {
    accessorKey: "professor",
    header: "Encargado",
  },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <ActionDialogManager<ActivityWithUser>
          data={activity}
          // viewDialog={}
          // editDialog={}
          // deleteDialog={}
        />
      );
    },
  },
];
