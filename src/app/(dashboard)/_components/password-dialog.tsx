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
import { Save, X } from "lucide-react";
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
    const { success, message } = await ChangePassword({ newPass, currentPass });
    if (message) {
      toast.error("Ocurrió un error intentando cambiar tu contraseña", {
        description: message,
      });
      return;
    }
    if (success) {
      toast.success("Se cambió exitosamente tu contraseña");
      reset();
      closeDialog();
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cambio de contraseña</DialogTitle>
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
              description="Requerido para verificar su identidad."
            />
            <PasswordInput
              label="Nueva contraseña"
              control={control}
              name="newPass"
              description="La contraseña debe contener al menos 8 caracteres."
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
              className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
              type="button"
              variant="outline"
              onClick={() => {
                reset();
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Spinner /> : <Save className="mr-2 h-4 w-4" />}
            Cambiar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
