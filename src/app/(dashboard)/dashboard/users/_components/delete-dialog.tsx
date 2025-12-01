"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/lib/types/users";
import { deleteUser } from "../actions";

type DialogContentProps = {
  data: User;
  closeDialog: () => void;
};

export default function DeleteDialog({
  data: user,
  closeDialog,
}: DialogContentProps) {
  const form = useForm();
  async function handleClick() {
    const { success, message } = await deleteUser({
      userId: user.id,
    });
    if (!success) {
      toast.error(message);
    } else {
      toast.success(`Se eliminó exitosamente el usuario ${user.name}`);
    }
    closeDialog();
  }

  return (
    <DialogContent className="w-4xl">
      <DialogHeader>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogDescription>
          Estás a punto de eliminar un usuario
        </DialogDescription>
      </DialogHeader>
      <div className="text-muted-foreground text-sm/normal">
        <span>Si eliminas este usuario:</span>
        <ul className="px-4 list-disc [&>li]:mt-2 py-1">
          <li>
            Toda su información y actividad dentro de la aplicación se perderá.
          </li>
          <li>No podrá volver a acceder con su cuenta.</li>
          <li>No podrás recuperar sus datos más adelante.</li>
        </ul>
        <p>Te recomendamos hacerlo solo si estás completamente seguro.</p>
        <p className="font-bold">Esta acción no se puede deshacer.</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <form onSubmit={form.handleSubmit(handleClick)}>
          <Button
            variant="destructive"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Eliminando..." : "Eliminar"}
          </Button>
        </form>
      </DialogFooter>
    </DialogContent>
  );
}
