"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { User } from "@/lib/types/users";
import CreateRequestDialog from "../../_components/create-request-dialog";
import { getHistoryPaginated } from "../actions";
import { getColumns } from "./colums";

interface HistoryDataTableProps {
  user: User;
  isAdmin: boolean;
  filter: "standard" | "other";
}

export function HistoryDataTable({ user, isAdmin, filter }: HistoryDataTableProps) {
  const filteredColumns = useMemo(() => {
    const allColumns = getColumns(isAdmin);

    if (isAdmin) {
      return allColumns;
    }

    const allowedColumns = ["certName", "state", "createdAt", "actions"];
    return allColumns.filter((col) => {
      const key = (col as any).accessorKey || col.id;
      return allowedColumns.includes(key);
    });
  }, [isAdmin]);

  const isStandard = filter === "standard";

  return (
    <DataTable
      emptyDescription={
        isStandard
          ? "No se han creado constancias. Para iniciar debe crear una constancia"
          : "No se han creado otras solicitudes."
      }
      emptyTitle={isStandard ? "No hay Solicitudes" : "No hay solicitudes"}
      buttonLabel={isStandard ? "Crear Solicitud" : undefined}
      createDialog={(props) => <CreateRequestDialog user={user} {...props} />}
      queryKey={`list-history-${filter}`}
      queryFn={({ pageParam }) =>
        getHistoryPaginated({
          pageParam,
          user,
          isAdmin,
          filter,
        })
      }
      columns={filteredColumns}
      placeholder={
        isAdmin
          ? "Filtrar por Nombre, Rol, RUT y Solicitud"
          : "Filtrar por Nombre de Solicitud"
      }
    >
      <ActionDialogManager
        createDialog={(props) => (
          <CreateRequestDialog user={user} {...props} />
        )}
        triggerLabel={isStandard ? "Crear Solicitud" : "Crear solicitud"}
      />
    </DataTable>
  );
}
