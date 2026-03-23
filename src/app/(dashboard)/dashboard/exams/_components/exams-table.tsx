"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { listExams, type Exams } from "../actions";
import { getColumns } from "./columns";

interface ExamsTableProps {
  isStudent: boolean;
  isAdmin: boolean;
}

export function ExamsTable({ isStudent, isAdmin }: ExamsTableProps) {
  const tblColumns = useMemo(() => getColumns(isAdmin), [isAdmin]);
  const filteredColumns = useMemo(
    () =>
      isStudent
        ? tblColumns.filter(
            (col) =>
              col.id !== "actions" &&
              (col as any).accessorKey !== "actions",
          )
        : tblColumns,
    [isStudent, tblColumns],
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
