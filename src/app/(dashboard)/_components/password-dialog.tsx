"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PasswordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { type NewPassword, newPasswordSchema } from "@/lib/types/users";
import { ChangePassword } from "../dashboard/users/actions";

export default function NewPasswordDialog({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { handleSubmit, control, formState, reset } = useForm<NewPassword>({
    resolver: arktypeResolver(newPasswordSchema),
    reValidateMode: "onChange",
    defaultValues: {
      currentPass: "",
      newPass: "",
      confirPass: "",
    },
  });
  const onSubmit = async (passData: NewPassword) => {
    const { newPass, currentPass } = passData;
    const { success, error } = await ChangePassword({ newPass, currentPass });
    if (error) {
      toast.error("Ocurrio un error intentando cambiar tu constraseña", {
        description: error,
      });
      return;
    }
    if (success) {
      toast.success("Se cambio exitosamente tu contraseña");
      reset();
      closeDialog();
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cambio de constraseña</DialogTitle>
        <DialogDescription>
          Ingresa tu contraseña actual, y la nueva contraseña dos veces para
          cambiar tu contraseña
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup className="flex flex-col gap-4 py-2">
            <PasswordInput
              label="Contraseña actual"
              control={control}
              name="currentPass"
              description="Solo para asegurarnos de que eres tú."
            />
            <PasswordInput
              label="Nueva contraseña"
              control={control}
              name="newPass"
              description="¡Hazla difícil de adivinar! Mín. 8 caracteres."
            />
            <PasswordInput
              label="Confirma nueva contraseña"
              control={control}
              name="confirPass"
              description="Asegúrate de que sean idénticas."
            />
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="hover:bg-destructive hover:text-destructive-foreground"
              type="button"
              variant="outline"
              onClick={() => {
                reset();
              }}
            >
              Canelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Spinner />}
            Cambiar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
