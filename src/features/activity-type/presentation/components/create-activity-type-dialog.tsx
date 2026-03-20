"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateActivityTypeForm from "./create-activity-type-form";

export default function CreateActivityTypeDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear tipo de actividad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crea un nuevo tipo de actividad</DialogTitle>
          <DialogDescription>
            Define el nombre y los roles de participación requeridos.
          </DialogDescription>
        </DialogHeader>
        <CreateActivityTypeForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
