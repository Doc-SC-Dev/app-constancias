"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Participant } from "@/lib/types/paricipant-activity";

// Extract the participant type from UserWithActivities

export const columns: ColumnDef<Participant>[] = [
  {
    accessorFn: (row) => row.activity.name,
    id: "activityName",
    header: "Nombre",
  },
  {
    accessorFn: (row) => row.activity.activityType,
    id: "activityType",
    header: "Tipo Actividad",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val.replace(/_/g, " ");
    },
  },
  {
    accessorKey: "hours",
    header: "Horas",
  },
  {
    accessorKey: "type",
    header: "Participación",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val.replace(/_/g, " ");
    },
  },
];
