"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type UserWithActivities } from "@/lib/types/users";

// Extract the participant type from UserWithActivities
type Participant = UserWithActivities["participants"][number];

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
