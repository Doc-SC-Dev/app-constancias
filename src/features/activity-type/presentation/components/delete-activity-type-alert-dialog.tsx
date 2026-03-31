"use client";

import { Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteActivityTypeAction } from "../actions";

export default function DeleteActivityTypeAlertDialog({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <DeleteActivityTypeAlertDialogContent
        id={id}
        currentName={currentName}
        goTable
        closeDialog={() => setOpen(false)}
      />
    </AlertDialog>
  );
}

export function DeleteActivityTypeAlertDialogContent({
  id,
  currentName,
  goTable = false,
  closeDialog,
}: {
  id: string;
  currentName: string;
  goTable?: boolean;
  closeDialog: () => void;
}) {
  const [isDeleting, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = async () => {
    startTransition(async () => {
      const result = await deleteActivityTypeAction(id);

      if (!result.isSuccess) {
        toast.error("Error al eliminar el tipo de actividad", {
          description: result.error,
        });
        return;
      }

      toast.success("Tipo de actividad eliminado correctamente");
      if (goTable) router.replace("/admin/activity-type");
      closeDialog();
    });
  };

  return (
    <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Está a punto de eliminar el tipo de actividad{" "}
          <strong>&quot;{currentName}&quot;</strong>. Esta acción no se puede
          deshacer y solo es posible si no hay actividades ni plantillas
          asociadas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </AlertDialogCancel>
        <Button onClick={onDelete} disabled={isDeleting} variant="default">
          {isDeleting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Eliminando...
            </>
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" /> Eliminar
            </>
          )}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
