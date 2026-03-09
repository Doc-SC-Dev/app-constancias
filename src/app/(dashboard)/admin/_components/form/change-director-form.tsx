"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { changeDirectorAction } from "../../actions";
import UserSelect from "./user-select";

const newDirectorSchema = type({
  userId: type("string> 1").configure(() => ({
    message:
      "Se debe seleccionar un usuario para definirilo como nuevo Director",
  })),
});
export type NewDirector = typeof newDirectorSchema.infer;

export default function ChangeDirectorForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const form = useForm<NewDirector>({
    resolver: arktypeResolver(newDirectorSchema),
    defaultValues: {
      userId: "",
    },
  });
  const onSubmit = async (data: NewDirector) => {
    const { error, value, isSuccess } = await changeDirectorAction({
      ...data,
      oldDirector: userId,
    });

    if (isSuccess && value) {
      toast.success("Se actualizo el director exitosamente", {
        description: `Ahora el usuario ${value?.name} es el Director de programa de doctorado`,
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["get-non-director-users"],
      });
    } else if (error) {
      toast.error("Ocurrio un error", { description: error });
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <UserSelect
            label="Posibles usuarios"
            description="Seleccione un usuario del listado para definirlo como el nuevo Director"
            disabled={form.formState.isSubmitting}
          />
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="outline">
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Guardando
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
