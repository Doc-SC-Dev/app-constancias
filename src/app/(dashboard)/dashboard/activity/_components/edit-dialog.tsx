"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormBase } from "@/components/form/base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ActivityType } from "@/generated/prisma";
import { type Activity, type ActivityEdit, activityEditSchema } from "@/lib/types/activity";
import { updateActivity } from "../actions";

type DialogContentProps = {
  data: Activity;
  closeDialog: () => void;
};

export default function EditDialog({
  data: activity,
  closeDialog,
}: DialogContentProps) {
  const { handleSubmit, control, formState, reset } = useForm<ActivityEdit>({
    resolver: arktypeResolver(activityEditSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: activity.name,
      activityType: activity.activityType as ActivityType, // Cast if needed
      nParticipants: activity.nParticipants,
      startAt: new Date(activity.startAt), // Ensure Date object
      endAt: new Date(activity.endAt), // Ensure Date object
    },
  });

  const onSubmit = async (data: ActivityEdit) => {
    const { success, message } = await updateActivity(data, activity.id);
    if (!success) {
      toast.error(message);
      return;
    }
    if (success) {
      toast.success(message);
      closeDialog();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar actividad</DialogTitle>
        <DialogDescription>
          Ingresar datos para realizar cambios en la actividad
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-4 py-2">
          <FormInput label="Nombre" control={control} name="name" />
          <FormSelect label="Tipo de Actividad" control={control} name="activityType">
            {Object.values(ActivityType).map((type) => (
              <SelectItem value={type} key={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </FormSelect>
          <FormBase
            control={control}
            name="nParticipants"
            label="Número de Participantes"
          >
            {(field) => (
              <Input
                {...field}
                type="number"
                min={1}
                max={30}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
          </FormBase>
          <FormBase control={control} name="startAt" label="Fecha de Inicio">
            {(field) => (
              <Input
                {...field}
                value={
                  field.value instanceof Date
                    ? new Date(
                        field.value.getTime() -
                          field.value.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                type="datetime-local"
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            )}
          </FormBase>
          <FormBase control={control} name="endAt" label="Fecha de Fin">
            {(field) => (
              <Input
                {...field}
                value={
                  field.value instanceof Date
                    ? new Date(
                        field.value.getTime() -
                          field.value.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                type="datetime-local"
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            )}
          </FormBase>
        </FieldGroup>
        <DialogFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                closeDialog();
              }}
            >
              Cancelar
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
