"use client";

import type { ColumnDef } from "@tanstack/react-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import type { HistoryEntry } from "@/lib/types/history";
import ViewDialog from "./history-view-dialog";

export const columns: ColumnDef<HistoryEntry>[] = [
  {
    accessorKey: "certName",
    header: "Tipo de Constancia",
    cell: ({ row }) => {
      const certName = row.original.certName;
      return <span className="flex flex-1 items-center">{certName}</span>;
    },
  },

  {
    accessorKey: "name",
    header: "Nombre de Usuario",
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="flex flex-1 items-center ">{name}</span>;
    },
  },


  {
    accessorKey: "role",
    header: () => <span className="flex flex-1 justify-center">Rol</span>,
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span className="flex flex-1 items-center justify-center">{role}</span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => (
      <span className="flex flex-1 justify-center">Fecha Creación</span>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      const formattedDate = date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return (
        <span className="flex flex-1 items-center justify-center">
          {formattedDate}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="flex flex-1 justify-center">Acción</span>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <div className="flex flex-1 items-center justify-center">
          <ActionDialogManager<HistoryEntry>
            data={entry}
            viewDialog={ViewDialog}
          />
        </div>
      );
    },
  },
];
