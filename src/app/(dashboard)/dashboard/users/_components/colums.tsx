"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { admin } from "@/lib/auth/better-auth/client";
import type { UserWithActivities } from "@/lib/types/users";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";
import ViewDialog from "./view-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserWithActivities>[] = [
  {
    accessorKey: "banned",
    header(_) {
      return <p className="text-center">Estado</p>;
    },
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
        <div className="flex items-center justify-center space-x-2">
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
  },
  {
    accessorKey: "role",
    header: "Rol",
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
  { accessorKey: "rut", header: "Rut" },
  {
    id: "actions",
    header: "Acción",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      // Todo: usar para realizar acciones sobrel el usuario
      const user = row.original;
      return (
        <ActionDialogManager<UserWithActivities>
          data={user}
          viewDialog={ViewDialog}
          editDialog={EditDialog}
          deleteDialog={DeleteDialog}
        />
      );
    },
  },
];
