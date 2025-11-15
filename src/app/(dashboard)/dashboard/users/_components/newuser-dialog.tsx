"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Roles } from "@/lib/authorization/permissions";
import { type UserCreate, userCreateSchema } from "@/lib/types/users";
import { createUser } from "../actions";

type DialogContentProps = {
  closeDialog: () => void;
};

export default function NewUserDialog({ closeDialog }: DialogContentProps) {
  const { handleSubmit, control, formState, reset, watch } =
    useForm<UserCreate>({
      resolver: arktypeResolver(userCreateSchema),
      reValidateMode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        role: "guest",
        rut: "",
        studentId: undefined,
      },
      shouldUnregister: true,
    });
  const role = watch("role");
  const onSubmit = async (user: UserCreate) => {
    console.log(user);
    const { data, error } = await createUser(user);
    if (error) {
      toast.error("No se pudo crear el usuario", {
        description: <p className="text-foreground">{error}</p>,
      });
    }
    if (data) {
      toast.success("Se creo el usuario correctamente", {
        description: (
          <p className="text-foreground">
            `Se creo un nuevo usuario con nombre ${data.name} y rol ${data.role}
            `
          </p>
        ),
      });
      reset();
      closeDialog();
    }
  };
  return (
    <DialogContent>
      <DialogHeader className="mb-4">
        <DialogTitle>Crear nuevo usuario</DialogTitle>
        <DialogDescription>
          Ingresar datos para crear un nuevo usuario
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
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
          {role === "student" && (
            <FormInput label="Matricula" control={control} name="studentId" />
          )}
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => reset()}>
            <Button variant="outline">Canelar</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting && <Spinner />}
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
