"use client";

import { Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
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
import type { AcademicDegree } from "../../domain/AcademicDegree";
import { useAcademicDegree } from "../hooks/useAcademicDegree";

export function DeleteDegreeAlertDialog({
  academicDegree,
}: {
  academicDegree: AcademicDegree;
}) {
  const { remove } = useAcademicDegree();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const result = await remove(academicDegree.id);
      if (result.isSuccess) {
        setOpen(false);
      }
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
          <AlertDialogCancel className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground">
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </AlertDialogCancel>
          <Button onClick={onDelete} variant="default" disabled={isPending}>
            {isPending ? (
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
    </AlertDialog>
  );
}
