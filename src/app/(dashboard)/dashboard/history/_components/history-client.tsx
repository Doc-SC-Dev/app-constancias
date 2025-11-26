"use client";

import { DataTable } from "@/components/data-table";
import type { HistoryEntry } from "@/lib/types/history";
import { columns } from "./colums";
import { useMemo } from "react";

interface HistoryClientProps {
  data: HistoryEntry[];
  userRole: string;
}

export function HistoryClient({ data, userRole }: HistoryClientProps) {
  const isAdmin = userRole === "administrator" || userRole === "superadmin";

  const filteredColumns = useMemo(() => {
    if (isAdmin) {
      return columns;
    }

    const allowedColumns = ["certName", "createdAt", "actions"];
    return columns.filter((col) => {
      // Check accessorKey or id
      const key = (col as any).accessorKey || col.id;
      return allowedColumns.includes(key);
    });
  }, [isAdmin]);

  return (
    <DataTable
      columns={filteredColumns}
      data={data}
      placeholder={
        isAdmin
          ? "Filtrar por Nombre, Rol, RUT y Constancia"
          : "Filtrar por Nombre de Constancia"
      }
    >
      <></>
    </DataTable>
  );
}
