"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { User } from "@/lib/types/users";
import CreateRequestDialog from "../../_components/create-request-dialog";
import { getHistoryPaginated } from "../actions";
import { columns } from "./colums";

interface HistoryClientProps {
  isAdmin: boolean;
  user: User;
}

export function HistoryClient({ isAdmin, user }: HistoryClientProps) {
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
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-2xl font-bold">Constancias</h2>
      <DataTable
        emptyDescription="No se han creado constancias. Para iniciar debe crear una constancia"
        emptyTitle="No hay constancias"
        buttonLabel="Crear constancia"
        createDialog={CreateRequestDialog}
        queryKey="list-history"
        queryFn={({ pageParam }) =>
          getHistoryPaginated({ pageParam, user, isAdmin })
        }
        columns={filteredColumns}
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
    </div>
  );
}
