"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type { Roles } from "@/lib/authorization/permissions";
import {
  type UserEdit,
  type UserWithAcademicDegree,
  userEditSchema,
} from "@/lib/types/users";
import { updateUser } from "../../actions";

export default function UserEditForm({
  user,
  closeSheet,
}: {
  user: UserWithAcademicDegree;
  closeSheet: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<UserEdit>({
    resolver: arktypeResolver(userEditSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      rut: user.rut,
      role: user.role as Roles,
    },
  });
  const onSubmit = async (data: UserEdit) => {
    const { success, message } = await updateUser(data);
    if (success) {
      toast.success("Se ha actualizado el usuario exitosamente", {
        description: message,
      });
      queryClient.invalidateQueries({ queryKey: ["list-users"] });
      closeSheet();
    } else {
      toast.error("Error al actualizar el usuario", {
        description: message,
      });
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-4"
    >
      <FieldGroup className="gap-4">
        <FormInput control={form.control} name="name" label="Nombre" />
        <FormInput control={form.control} name="rut" label="RUT" />
        <FormInput control={form.control} name="email" label="Email" />
        <FormSelect control={form.control} name="role" label="Rol">
          {}
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="STUDENT">Estudiante</SelectItem>
          <SelectItem value="PROFESSOR">Profesor</SelectItem>
        </FormSelect>
      </FieldGroup>
      <SheetFooter>
        <SheetClose asChild>
          <Button 
            variant="outline" 
            type="button"
            className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </>
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
