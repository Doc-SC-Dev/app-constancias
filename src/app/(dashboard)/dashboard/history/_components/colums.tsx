"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent, 
  PopoverTrigger,
} from "@/components/ui/popover";
import type { HistoryEntry } from "@/lib/types/history";
import { Certificates } from "@/lib/types/request";
import { Textos } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import DescriptionViewDialog from "./description-view-dialog";
import HistoryStateDialog from "./history-state-dialog";

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

  if (state === "REJECTED") {
    badgeClass = "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    dotClass = "bg-red-500";
  } else if (state === "PENDING") {
    badgeClass =
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    dotClass = "bg-yellow-500";
  }

  const label = Textos.State[state] || state;

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
      const description = row.original.description;

      return (
        <span className="flex flex-1 items-center gap-2">
          {certName}
          {description && (
            <Popover>
              <PopoverTrigger asChild>
                <CircleHelp className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Descripción</h4>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </span>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Nombre de Usuario",
    meta: { className: "w-[180px]" },
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="flex flex-1 items-center ">{name}</span>;
    },
  },

  {
    accessorKey: "role",
    header: () => <span className="flex flex-1 justify-center">Rol</span>,
    meta: { className: "w-[180px]" },
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span className="flex flex-1 items-center justify-center">
          <Badge
            variant={role === "administrator" ? "destructive" : "outline"}
          >
            {Textos.Role[role as string] || role}
          </Badge>
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => (
      <span className="flex flex-1 justify-center">Fecha Creación</span>
    ),
    meta: { className: "w-[180px]" },
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
    meta: { className: "w-[180px]" },
    cell: ({ row }) => <StateCell entry={row.original} isAdmin={isAdmin} />,
  },

  {
    id: "actions",
    header: () => <span className="flex flex-1 justify-center">Acción</span>,
    meta: { className: "w-[120px]" },
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const entry = row.original;
      const isDownloadDisabled =
        entry.state === "PENDING" || entry.state === "REJECTED";
      const canViewReason = entry.state === "REJECTED";
      const isOther = entry.certName === Certificates.OTHER;

      return (
        <div className="flex flex-1 items-center justify-center">
          <ActionDialogManager<HistoryEntry>
            data={entry}
            isHistory={true}
            isDownloadDisabled={isDownloadDisabled}
            canViewReason={canViewReason}
            viewDialog={isOther ? DescriptionViewDialog : undefined}
          />
        </div>
      );
    },
  },
];
