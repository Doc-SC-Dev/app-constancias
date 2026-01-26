"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";
import { Certificates } from "@/lib/types/request";
import { cn } from "@/lib/utils";
import HistoryStateDialog from "./history-state-dialog";

// Helper component for the state cell to manage dialog state
function StateCell({
  entry,
  isAdmin,
}: {
  entry: HistoryEntry;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const state = entry.state;
  const isStandardCertificate = entry.certName !== Certificates.OTHER;

  let badgeClass =
    "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
  let dotClass = "bg-green-500";
  let label = "Aprobada";

  if (state === "REJECTED") {
    badgeClass = "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    dotClass = "bg-red-500";
    label = "Rechazada";
  } else if (state === "PENDING") {
    badgeClass =
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    dotClass = "bg-yellow-500";
    label = "En proceso";
  }

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 font-normal hover:opacity-80 transition-opacity",
        badgeClass,
        !isStandardCertificate && isAdmin && "cursor-pointer",
      )}
    >
      <span className={cn("size-2 rounded-full", dotClass)} />
      {label}
    </Badge>
  );

  if (isStandardCertificate || !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center">{badge}</div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-1 items-center justify-center">
        <DialogTrigger asChild>{badge}</DialogTrigger>
      </div>
      <HistoryStateDialog data={entry} closeDialog={() => setOpen(false)} />
    </Dialog>
  );
}

export const getColumns = (isAdmin: boolean): ColumnDef<HistoryEntry>[] => [
  {
    accessorKey: "certName",
    header: "Tipo de Constancia",
    meta: { className: "w-[300px]" },
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
    accessorKey: "state",
    header: () => <span className="flex flex-1 justify-center">Estado</span>,
    cell: ({ row }) => <StateCell entry={row.original} isAdmin={isAdmin} />,
  },

  {
    id: "actions",
    header: () => <span className="flex flex-1 justify-center">Acción</span>,
    meta: { className: "w-[200px]" },
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const entry = row.original;
      const isDownloadDisabled =
        entry.state === "PENDING" || entry.state === "REJECTED";
      const canViewReason = entry.state === "REJECTED";

      return (
        <div className="flex flex-1 items-center justify-center">
          <ActionDialogManager<HistoryEntry>
            data={entry}
            isHistory={true}
            isDownloadDisabled={isDownloadDisabled}
            canViewReason={canViewReason}
          />
        </div>
      );
    },
  },
];
