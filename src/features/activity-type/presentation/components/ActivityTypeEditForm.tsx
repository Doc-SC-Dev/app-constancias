"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  type UpdateActivityTypeNameForm,
  UpdateActivityTypeNameSchema,
} from "../../infrastructure/activity-type.schema";
import { updateActivityTypeAction } from "../actions";

export default function ActivityTypeEditForm({
  id,
  name,
  onOpenChange,
}: {
  id: string;
  name: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { control, handleSubmit, formState } =
    useForm<UpdateActivityTypeNameForm>({
      resolver: arktypeResolver(UpdateActivityTypeNameSchema),
      defaultValues: {
        id,
        name,
      },
      mode: "onChange",
      reValidateMode: "onSubmit",
    });

  const onSave = async (data: UpdateActivityTypeNameForm) => {
    const { isSuccess, value, error } = await updateActivityTypeAction(
      data.id,
      data.name,
    );
    if (isSuccess) {
      toast.success("Tipo de actividad actualizado correctamente", {
        description: `Se cambió exitosamente el nombre del tipo de actividad de ${name} a ${value.name}`,
      });
      onOpenChange(false);
    } else {
      toast.error("Error al actualizar el tipo de actividad", {
        description: error,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6 py-4">
      <FieldGroup>
        <FormInput
          control={control}
          name="name"
          label="Nombre"
          description="Ingresa un nuevo nombre para el tipo de actividad."
        />
      </FieldGroup>
      <DialogFooter className="gap-2">
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={formState.isSubmitting || !formState.dirtyFields.name}
        >
          {formState.isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Guardar
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
