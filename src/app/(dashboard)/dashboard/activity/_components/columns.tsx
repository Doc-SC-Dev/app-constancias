"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ParticipantActivity } from "@/lib/types/paricipant-activity";
import { Badge } from "@/components/ui/badge";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { type Activity } from "@/lib/types/activity";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";
import ViewDialog from "./activity-view-dialog";

export const columns: ColumnDef<ParticipantActivity>[] = [
  {
    accessorKey: "activityName",
    header: "Actividad",
  },
  {
    accessorKey: "activityType",
    header: "Tipo de Actividad",
    cell: ({ row }) => {
      const type = row.getValue("activityType") as string;
      return (
        <Badge variant="outline">
          {type.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "hours",
    header: "Horas",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("hours")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Participación",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return type.replace(/_/g, " ");
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha Registro",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Acción",
    cell: ({ row }) => {
      const activity = row.original.activity;

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
