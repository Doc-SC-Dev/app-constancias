"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { HistoryEntry } from "@/lib/types/history";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewDialog from "../../users/_components/view-dialog";

export const columns: ColumnDef<HistoryEntry>[] = [
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
    accessorKey: "certName",
    header: "Constancia",
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
      const formattedTime = date.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${formattedDate} ${formattedTime}`;
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
                user={{
                  id: entry.id,
                  name: entry.name,
                  email: "",
                  image: undefined,
                  createdAt: entry.createdAt,
                  updatedAt: entry.updatedAt,
                  emailVerified: false,
                  rut: entry.rut,
                  banned: false,
                  role: entry.role as string,
                }}
                certName={entry.certName}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
    },
  },
];
