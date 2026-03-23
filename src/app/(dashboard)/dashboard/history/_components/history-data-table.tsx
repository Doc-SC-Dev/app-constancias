"use client";

import { useMemo } from "react";
import { LazyDataTable } from "@/components/dynamic-table";
import type { User } from "@/lib/types/users";
import { getHistoryPaginated } from "../actions";
import { getColumns } from "./colums";
import CreateRequestDialog from "./dialog/create-request-dialog";

interface HistoryDataTableProps {
  user: User;
  isAdmin: boolean;
  filter: "standard" | "other";
}

export function HistoryDataTable({
  user,
  isAdmin,
  filter,
}: HistoryDataTableProps) {
  const filteredColumns = useMemo(() => {
    const allColumns = getColumns(isAdmin);

    if (isAdmin) {
      return allColumns;
    }

    const allowedColumns = ["certName", "state", "createdAt", "actions"];
    return allColumns.filter((col) => {
      const key = "accessorKey" in col ? (col.accessorKey as string) : col.id;
      return key && allowedColumns.includes(key);
    });
  }, [isAdmin]);

  const isStandard = filter === "standard";

  return (
    <LazyDataTable
      emptyDescription={
        isStandard
          ? "No se han recibido solicitudes de constancia"
          : "No se han recibido solicitudes especiales."
      }
      emptyTitle={isStandard ? "No hay Solicitudes" : "No hay solicitudes"}
      createDialog={() => <CreateRequestDialog user={user} />}
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
      containerClassName="h-fit max-h-full"
    />
  );
}
