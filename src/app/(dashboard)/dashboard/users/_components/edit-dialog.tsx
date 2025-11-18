"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { type Role, Roles } from "@/lib/authorization/permissions";
import { type User, type UserEdit, userEditSchema } from "@/lib/types/users";
import { updateUser } from "../actions";

type DialogContentProps = {
  user: User;
  closeDialog: () => void;
};

export default function EditDialog({ user, closeDialog }: DialogContentProps) {
  const { handleSubmit, control, formState, reset } = useForm<UserEdit>({
    resolver: arktypeResolver(userEditSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role as Role,
      rut: user.rut,
    },
  });
  const onSubmit = async (userData: UserEdit) => {
    const { data, error } = await updateUser(userData, user.id);
    if (error) {
      toast.error(error);
      return;
    }
    if (data) {
      toast.success(
        `Se actualizo exitosamente el usario de nombre ${data.name}`,
      );
      closeDialog();
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogDescription>
          Ingresar datos para realizar cambios en el usuario
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-4 py-2">
          <FormInput label="Nombre" control={control} name="name" />
          <FormInput label="Email" control={control} name="email" />
          <FormSelect label="Rol" control={control} name="role">
            {[...Object.values(Roles)].map((rol) => (
              <SelectItem value={rol} key={rol}>
                {rol}
              </SelectItem>
            ))}
          </FormSelect>
          <FormInput label="Rut" control={control} name="rut" />
        </FieldGroup>
        <DialogFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                closeDialog();
              }}
            >
              Canelar
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Spinner />}
              Guardar
            </Button>
          </Field>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
