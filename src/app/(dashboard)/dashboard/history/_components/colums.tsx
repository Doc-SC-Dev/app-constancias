"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { HistoryEntry } from "@/lib/types/history";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewDialog from "./history-view-dialog";

export const columns: ColumnDef<HistoryEntry>[] = [
  {
    accessorKey: "certName",
    header: "Constancia",
  },

  {
    accessorKey: "name",
    header: "Nombre",
  },

  {
    accessorKey: "rut",
    header: "RUT",
  },

  {
    accessorKey: "role",
    header: "Rol",
  },

  {
    accessorKey: "createdAt",
    header: "Fecha Creación",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      const formattedDate = date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      
      return `${formattedDate}`;
    },
  },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const entry = row.original;
      const [open, setOpen] = useState(false);
      return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Ver</span>
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <ViewDialog
                data={entry}
                certName={entry.certName}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
    },
  },
];
