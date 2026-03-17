"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import { Check, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { auditedCreateActivityType } from "../../actions";
import ParticipantTypeField from "./participant-type-field";

const createActivityTypeSchema = type({
  name: type.string,
  participantTypes: type({
    name: type.string,
    required: type.boolean,
  }).array(),
});

export type CreateActivityType = typeof createActivityTypeSchema.infer;

export default function CreateActivityTypeForm() {
  const queryClient = useQueryClient();
  const form = useForm<CreateActivityType>({
    resolver: arktypeResolver(createActivityTypeSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      participantTypes: [],
    },
  });

  const onSubmit = async (data: CreateActivityType) => {
    const { error, isSuccess, value } = await auditedCreateActivityType(data);

    if (!isSuccess && error) {
      toast.error(
        "Ha ocurrido un error a tratar de crear el tipo de actividad",
        {
          description: error,
        },
      );
      return;
    }

    if (value) {
      toast.success("Se a creado el nuevo tipo de actividad", {
        description: `Se creo existosament el tipo de actividad con nombre ${value.name} con ${value.nParticipantsTypes} tipos de participantes.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["get-paginated-activity-types"],
      });
      form.reset();
      return;
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="container gap-4">
          <FormInput
            control={form.control}
            name="name"
            description="Ingrese en nombre con el que se mostrar el tipo de actividad en la aplicación"
            placeholder="Ingrese nombre del tipo de actividad"
          />
          <ParticipantTypeField />
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => form.reset()}>
            <Button type="button" variant="destructive">
              <X />
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="outline">
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Guardando
              </>
            ) : (
              <>
                <Check />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
