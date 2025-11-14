"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { auth } from "@/lib/auth";
import DropdownDialog from "./_components/dropdown-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type user = typeof auth.$Infer.Session.user;

export const columns: ColumnDef<user>[] = [
  {
    accessorKey: "banned",
    header(_) {
      return <p className="text-center">Estado</p>;
    },
    enableGlobalFilter: false,
    cell({ row }) {
      // TODO: usar para realizar acciones sobre el usuario
      const user = row.original;
      return (
        <div className="flex items-center justify-center space-x-2">
          <Switch
            id={`switch-${row.id}`}
            checked={!row.getValue("banned") as boolean}
          />
          <Label htmlFor={`switch-${row.id}`}>
            {(!row.getValue("banned") as boolean) ? "Activo" : "Desactivo"}
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell({ row }) {
      return (
        <Badge
          variant={row.getValue("role") === "admin" ? "destructive" : "outline"}
        >{`${(row.getValue("role") as string).toUpperCase().replace("_", "-")}`}</Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  { accessorKey: "id", header: "Matricula" },
  { accessorKey: "rut", header: "Rut" },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      // Todo: usar para realizar acciones sobrel el usuario
      const user = row.original;
      return <DropdownDialog user={user} />;
    },
  },
];
