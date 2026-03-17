"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  type CreateActivityTypeFormDto,
  CreateActivityTypeSchema,
} from "../../infrastructure/activity-type.schema";
import { createActivityTypeAction } from "../actions";
import ParticipantTypeField from "./participant-type-field";

export default function CreateActivityTypeForm() {
  const queryClient = useQueryClient();
  const form = useForm<CreateActivityTypeFormDto>({
    resolver: arktypeResolver(CreateActivityTypeSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      participantTypes: [],
    },
  });

  const onSubmit = async (data: CreateActivityTypeFormDto) => {
    const result = await createActivityTypeAction(data);

    if (!result.isSuccess && result.error) {
      toast.error("Error al crear tipo de actividad", {
        description: result.error,
      });
      return;
    }

    if (result.value) {
      toast.success("Tipo de actividad creado", {
        description: `Se creó correctamente "${result.value.name}".`,
      });
      queryClient.invalidateQueries({
        queryKey: ["get-paginated-activity-types"],
      });
      form.reset();
      // Close dialog handled by DialogClose or parent
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <FormInput
            control={form.control}
            name="name"
            label="Nombre"
            description="Nombre del tipo de actividad para mostrar en la aplicación"
            placeholder="Ej: Curso, Taller, Conferencia"
          />
          <ParticipantTypeField />
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => form.reset()}>
            <Button type="button" variant="destructive">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Guardando
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
