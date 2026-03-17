import { Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
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
import { auditedDeleteAcademicDegree } from "../../actions";
import type { AcademicDegreeDto } from "../config-grades";

export default function DeleteDegreeAlertDialog({
  academicDegree,
}: {
  academicDegree: AcademicDegreeDto;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const { value, isSuccess, error } = await auditedDeleteAcademicDegree(
        academicDegree.id,
      );
      if (!isSuccess)
        toast.error("Ha ocurrido un error al eliminar el grado académico", {
          description: error,
        });
      else
        toast.success("Eliminado con éxito", {
          description: `El grado académico ${value.name.length > 25 ? `${academicDegree.name.slice(0, 25)}...` : value.name} ha sido eliminado correctamente`,
        });
      setOpen(false);
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="group flex items-center justify-center transition-all duration-300 ease-in-out hover:gap-2 gap-0 px-3 hover:px-4 "
          variant="destructive"
        >
          <Trash className="h-4 w-4 shrink" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100">
            Eliminar
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de que quieres eliminar este grado académico?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Al eliminar este grado académico,
            se eliminarán todas las constancias asociadas a él.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <X className="mr-2" />
            Cancelar
          </AlertDialogCancel>
          <Button onClick={onDelete} variant="destructive" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2" /> Eliminando
              </>
            ) : (
              <>
                <Trash className="mr-2" /> Eliminar
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
