"use client";

import type { ColumnDef } from "@tanstack/react-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { Activity } from "@/lib/types/activity";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";
import ViewDialog from "./activity-view-dialog";

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "activityType",
    header: "Tipo",
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
    accessorKey: "professorId",
    header: "Encargado",
  },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <ActionDialogManager<Activity>
          data={activity}
          viewDialog={ViewDialog}
          editDialog={EditDialog}
          deleteDialog={DeleteDialog}
        />
      );
    },
  },
];
