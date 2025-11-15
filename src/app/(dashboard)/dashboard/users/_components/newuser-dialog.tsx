"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
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
import { Roles } from "@/lib/authorization/permissions";
import { type UserEdit, userEditSchema } from "@/lib/types/users";

type DialogContentProps = {
  closeDialog: () => void;
};

export default function NewUserDialog({ closeDialog }: DialogContentProps) {
  const { handleSubmit, control } = useForm<UserEdit>({
    resolver: arktypeResolver(userEditSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "guest",
      rut: "",
    },
  });
  return (
    <DialogContent>
      <DialogHeader className="mb-4">
        <DialogTitle>Crear nuevo usuario</DialogTitle>
        <DialogDescription>
          Ingresar datos para crear un nuevo usuario
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(() => {});
          closeDialog();
        }}
      >
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
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Canelar</Button>
          </DialogClose>
          <Button type="submit" variant="default">
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
