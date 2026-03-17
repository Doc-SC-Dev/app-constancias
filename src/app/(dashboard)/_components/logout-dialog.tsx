"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { logoutAction } from "../action";

export default function LogoutDialog() {
  const form = useForm();
  return (
    <DialogContent className="w-sm">
      <DialogTitle>Confirmar cierre de sesión</DialogTitle>
      <DialogDescription>
        Por motivos de seguridad, los datos de la sesión actual serán eliminados.
        Deberá iniciar sesión nuevamente para acceder al sistema.
      </DialogDescription>
      <DialogFooter className="flex gap-4">
        <DialogClose>Cancelar</DialogClose>
        <Button
          type="button"
          className="bg-destructive hover:bg-destructive/75"
          onClick={form.handleSubmit(logoutAction)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner />}
          Cerrar sesión
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
