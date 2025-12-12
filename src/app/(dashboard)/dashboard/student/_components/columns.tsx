"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import type { Student } from "@/lib/types/students";
import { updateRegularStudent } from "../action";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "isRegular",
    header: () => <p className="flex flex-1 justify-center">Estado</p>,
    enableGlobalFilter: false,
    cell({ row }) {
      const isRegular = row.getValue("isRegular") as boolean;
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [checked, setChecked] = useState<boolean>(isRegular);
      const handleSwitchChange = async () => {
        setIsLoading(true);
        const { success, message } = await updateRegularStudent({
          studentId: row.getValue("id") as number,
          isRegular: !checked,
        });
        if (!success) {
          toast.error("Error al actualizar el estado del estudiante", {
            description: message,
          });
          return;
        } else setChecked(!checked);
        setIsLoading(false);
      };
      return (
        <div className="flex flex-1 items-center justify-center space-x-2">
          {isLoading && <Spinner />}
          {!isLoading && (
            <>
              <Switch
                id={`switch-${row.id}`}
                checked={checked}
                onCheckedChange={handleSwitchChange}
                disabled={isLoading}
              />
              <Label htmlFor={`switch-${row.id}`}>
                {checked ? "Regular" : "No regular"}
              </Label>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => <p className="flex flex-1 justify-center">Matricula</p>,
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p>{row.getValue("id")}</p>
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
    accessorKey: "admissionDate",
    header: () => <p className="flex flex-1 justify-center">Año de admisión</p>,
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p>{row.getValue("admissionDate")}</p>
        </div>
      );
    },
  },
];
