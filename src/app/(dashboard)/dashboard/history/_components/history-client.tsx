"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HistoryEntry } from "@/lib/types/history";
import type { User } from "@/lib/types/users";
import CreateRequestDialog from "../../_components/create-request-dialog";
import { getHistoryPaginated } from "../actions";
import { getColumns } from "./colums";

interface HistoryClientProps {
  isAdmin: boolean;
  user: User;
}

export function HistoryClient({ isAdmin, user }: HistoryClientProps) {
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

  const [activeTab, setActiveTab] = useState<"standard" | "other">("standard");

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Constancias</h2>
      </div>

      <Tabs
        defaultValue="standard"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "standard" | "other")}
        className="h-full flex flex-col"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="standard">Solicitudes de Constancias</TabsTrigger>
          <TabsTrigger value="other">Otras Constancias</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="flex-1 flex flex-col">
          <DataTable
            emptyDescription="No se han creado constancias. Para iniciar debe crear una constancia"
            emptyTitle="No hay constancias"
            buttonLabel="Crear constancia"
            createDialog={() => <CreateRequestDialog user={user} />}
            queryKey="list-history-standard"
            queryFn={({ pageParam }) =>
              getHistoryPaginated({
                pageParam,
                user,
                isAdmin,
                filter: "standard",
              })
            }
            columns={filteredColumns}
            placeholder={
              isAdmin
                ? "Filtrar por Nombre, Rol, RUT y Constancia"
                : "Filtrar por Nombre de Constancia"
            }
          >
            <ActionDialogManager
              createDialog={() => <CreateRequestDialog user={user} />}
              triggerLabel="Crear constancia"
            />
          </DataTable>
        </TabsContent>

        <TabsContent value="other" className="flex-1 flex flex-col">
          <DataTable
            emptyDescription="No se han creado otras solicitudes."
            emptyTitle="No hay solicitudes"
            createDialog={() => <CreateRequestDialog user={user} />}
            queryKey="list-history-other"
            queryFn={({ pageParam }) =>
              getHistoryPaginated({ pageParam, user, isAdmin, filter: "other" })
            }
            columns={filteredColumns}
            placeholder={
              isAdmin
                ? "Filtrar por Nombre, Rol, RUT y Constancia"
                : "Filtrar por Nombre de Constancia"
            }
          >
            <ActionDialogManager
              createDialog={() => <CreateRequestDialog user={user} />}
              triggerLabel="Crear solicitud"
            />
          </DataTable>
        </TabsContent>
      </Tabs>
    </div>
  );
}
