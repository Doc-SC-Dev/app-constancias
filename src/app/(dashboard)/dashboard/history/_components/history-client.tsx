"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { HistoryEntry } from "@/lib/types/history";
import CreateRequestDialog from "../../_components/create-request-dialog";
import { columns } from "./colums";

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
      <ActionDialogManager
        createDialog={CreateRequestDialog}
        triggerLabel="Crear constancia"
      />
    </DataTable>
  );
}
