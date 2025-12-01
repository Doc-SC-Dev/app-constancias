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

import { useSession } from "@/lib/auth/better-auth/client";
import { Roles } from "@/lib/authorization/permissions";
import { type UserCreate, userCreateSchema } from "@/lib/types/users";
import { createUser } from "../actions";
import { AcademicGrade } from "@/generated/prisma/enums";

type DialogContentProps = {
  closeDialog?: () => void;
};

export default function NewUserDialog({ closeDialog }: DialogContentProps) {
  const { data } = useSession();
  const { handleSubmit, control, formState, reset, watch } =
    useForm<UserCreate>({
      resolver: arktypeResolver(userCreateSchema),
      reValidateMode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        role: Roles.GUEST,
        rut: "",
        studentId: undefined,
        academicGrade: undefined,
      },
      shouldUnregister: true,
    });
  const role = watch("role");
  const onSubmit = async (user: UserCreate) => {
    const { success, message } = await createUser(user);
    if (!success) {
      toast.error("No se pudo crear el usuario", {
        description: message,
      });
    }
    if (success) {
      toast.success("Se creo el usuario correctamente", {
        description: message,
      });
      reset();
      if (closeDialog) closeDialog();
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
          <FormInput
            label="Nombre"
            control={control}
            name="name"
            description="Ingresar el nombre completo del nuevo usuario"
          />
          <FormInput
            label="Email"
            control={control}
            name="email"
            description="Ingresar el correo que tendra asociado la cuenta del nuevo usuario"
          />
          <FormSelect
            label="Rol"
            control={control}
            name="role"
            description="Seleccione el rol que tendra en la plataforma en nuevo usuario"
          >
            {[...Object.values(Roles)].map((rol) => {
              if (
                data?.user.role !== Roles.SUPERADMIN &&
                rol === Roles.SUPERADMIN
              ) {
                return undefined;
              }
              return (
                <SelectItem value={rol} key={rol}>
                  {rol}
                </SelectItem>
              );
            })}
          </FormSelect>
          <FormInput
            label="Rut"
            control={control}
            name="rut"
            description="Las contraseña de los nuevo usuario sera su RUT sin puntos y con guión"
          />
          {role === "student" && (
            <FormInput
              label="Matricula"
              control={control}
              name="studentId"
              description="Ingresar el numero de matricual del nuevo estudiante"
            />
          )}
          <FormSelect
            label="Grado académico"
            control={control}
            name="academicGrade"
            description="Seleccione el grado académico del nuevo usuario"
          >
            {Object.values(AcademicGrade).map((grade) => (
              <SelectItem value={grade} key={grade}>
                {grade.toLowerCase()}
              </SelectItem>
            ))}
          </FormSelect>
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => reset()}>
            <Button variant="outline">Cancelar</Button>
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
