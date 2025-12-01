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
      <DialogTitle>¿Estas seguro?</DialogTitle>
      <DialogDescription>
        Por seguridad, todos tus datos temporales se limpiarán y deberás volver
        a iniciar sesión para continuar.
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
