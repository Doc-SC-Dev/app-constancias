"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { type Exams, listExams } from "../actions";
import { columns } from "./columns";

interface ExamsTableProps {
  isStudent: boolean;
}

export function ExamsTable({ isStudent }: ExamsTableProps) {
  const filteredColumns = useMemo(
    () =>
      isStudent
        ? columns.filter(
            (col) =>
              col.id !== "actions" &&
              (col as { accessorKey?: string }).accessorKey !== "actions",
          )
        : columns,
    [isStudent],
  );

  return (
    <DataTable<Exams>
      emptyTitle="No hay exámenes"
      emptyDescription="No hay exámenes registrados."
      columns={filteredColumns}
      queryKey="list-exams"
      queryFn={listExams}
      placeholder="Filtrar por actividad, tipo de activiad y profesor a cargo"
    />
  );
}
