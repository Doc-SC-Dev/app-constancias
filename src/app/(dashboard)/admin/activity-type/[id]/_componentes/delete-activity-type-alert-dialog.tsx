"use client";
import { Trash } from "lucide-react";
import { useTransition } from "react";
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
import { auditedDeleteActivityType } from "../actions";

export default function DeleteActivityTypeAlertDialog({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
}) {
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { isSuccess, error, value } = await auditedDeleteActivityType(id);
      if (!isSuccess) {
        toast.error("Error al eliminar el tipo de actividad", {
          description: error as string,
        });
        return;
      }
      toast.success(
        `Tipo de actividad con nombre "${value.name}" fue eliminado correctamente.`,
      );
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={isDeleting}>
          <span className="sr-only">Eliminar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar el tipo de actividad{" "}
            <strong>&quot;{currentName}&quot;</strong>. Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            asChild
          >
            <Button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Spinner className="h-4 w-4" /> Eliminando
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4" /> Eliminar
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
