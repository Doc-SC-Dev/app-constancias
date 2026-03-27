"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangeDirectorForm from "../form/change-director-form";

export function EditDirectorDialog({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Edit />
          Cambiar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambio de Director</DialogTitle>
          <DialogDescription>
            Selecciona un usuario de la lista para reemplazar al director actual{" "}
            <strong>{name}</strong> y otorgarle el cargo de Director. Este
            usuario tendrá permisos para gestionar el departamento y supervisar
            las métricas del equipo.
          </DialogDescription>
        </DialogHeader>
        <ChangeDirectorForm userId={userId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
