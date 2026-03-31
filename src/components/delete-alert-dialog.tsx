"use client";
import { Trash, X } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export default function DeleteAlertDialog({
  description,
  onAccept,
}: {
  description: string;
  onAccept: () => Promise<void>;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmar eliminación de registro</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="default" onClick={onAccept}>
            <Trash className="mr-2 h-4 w-4" />
            Continuar
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
