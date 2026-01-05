"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { UserActivityDTO } from "@/lib/types/paricipant-activity";

// Extract the participant type from UserWithActivities

export const columns: ColumnDef<UserActivityDTO>[] = [
  {
    accessorFn: (row) => row.activityName,
    id: "activityName",
    header: "Nombre",
  },
  {
    accessorFn: (row) => row.activityType,
    id: "activityType",
    header: "Tipo Actividad",
    cell: ({ getValue }) => {
      const val = getValue<string>();
      return val.replace(/_/g, " ");
    },
  },
  {
    accessorKey: "hours",
    header: "Horas",
  },
  {
    accessorKey: "typeName",
    header: "Participación",
    cell: ({ getValue }) => {
      const val = getValue<string>();
      return val.replace(/_/g, " ");
    },
  },
];
