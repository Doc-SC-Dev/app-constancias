"use client";

import { useMemo } from "react";
import { LazyDataTable } from "@/components/dynamic-table";
import { type Exams, listExams } from "../actions";
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
              (col as { accessorKey?: string }).accessorKey !== "actions",
          )
        : tblColumns,
    [isStudent, tblColumns],
  );

  return (
    <LazyDataTable<Exams>
      emptyTitle="No hay exámenes"
      emptyDescription="No hay exámenes registrados."
      columns={filteredColumns}
      queryKey="list-exams"
      queryFn={listExams}
      placeholder="Filtrar por actividad, tipo de activiad y profesor a cargo"
      containerClassName="h-fit max-h-full"
    />
  );
}
