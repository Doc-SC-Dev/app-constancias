"use client";
import { Pencil } from "lucide-react";
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
import type { ActivityType } from "../../domain/ActivityType";
import ActivityTypeEditForm from "./ActivityTypeEditForm";

export default function ActivityTypeEditDialog({
  activityType,
}: {
  activityType: ActivityType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tipo de Actividad</DialogTitle>
          <DialogDescription>
            Cambia el nombre para el tipo de actividad.
          </DialogDescription>
        </DialogHeader>
        <ActivityTypeEditForm
          name={activityType.name}
          id={activityType.id}
          onOpenChange={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
