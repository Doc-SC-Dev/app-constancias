"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import LinkActionButton from "@/components/link-action-button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { admin } from "@/lib/auth/better-auth/client";
import type { User } from "@/lib/types/users";
import { Textos } from "@/lib/utils";
import DeleteDialog from "./delete-dialog";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "banned",
    header: () => <p className="flex flex-1 justify-center">Estado</p>,
    enableGlobalFilter: false,
    cell({ row }) {
      const user = row.original;
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [checked, setChecked] = useState<boolean>(!user.banned as boolean);
      const handleSwitchChange = async () => {
        setIsLoading(true);
        if (checked) {
          await admin.banUser({
            userId: user.id,
          });
          setChecked(false);
        } else {
          await admin.unbanUser({
            userId: user.id,
          });
          setChecked(true);
        }
        setIsLoading(false);
      };
      return (
        <div className="flex flex-1 items-center justify-center space-x-2">
          <Switch
            id={`switch-${row.id}`}
            checked={checked}
            onCheckedChange={handleSwitchChange}
            disabled={isLoading}
          />
          <Label htmlFor={`switch-${row.id}`}>
            {checked ? "Activo" : "Inactivo"}
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center ">
          <p>{row.getValue("name")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <p className="flex flex-1 justify-center">Rol</p>,
    cell({ row }) {
      return (
        <span className="flex flex-1 items-center justify-center">
          <Badge
            variant={
              row.getValue("role") === "admin" ? "destructive" : "outline"
            }
          >
            {Textos.Role[row.getValue("role") as string] || row.getValue("role")}
          </Badge>
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <p className="flex flex-1">Email</p>,
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center">
          <p>{row.getValue("email")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "rut",
    header: () => <p className="flex flex-1 justify-center">Rut</p>,
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p>{row.getValue("rut")}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <p className="flex flex-1 justify-center">Acción</p>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <span className="flex flex-1 items-center justify-center">
          <LinkActionButton
            data={user}
            seeLink={`/dashboard/users/${user.id}`}
            editLink={`/dashboard/users/${user.id}/edit`}
            deleteDialog={DeleteDialog}
          />
        </span>
      );
    },
  },
];
