"use client";
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
  onAccept: () => void;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" onClick={onAccept}>
            Continuar
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
