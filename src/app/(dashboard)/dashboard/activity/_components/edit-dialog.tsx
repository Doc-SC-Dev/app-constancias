"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormNumberInput } from "@/components/form/form-number-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityType } from "@/generated/prisma";
import {
  type ActivityEdit,
  ParticipantType,
  activityEditSchema,
} from "@/lib/types/activity";
import { listUsersAdmin } from "../../users/actions";
import { updateActivity } from "../actions";

type DialogContentProps = {
  data: any; // Using any to bypass strict type check on participants for now, as types are complex
  closeDialog: () => void;
};

export default function EditDialog({
  data: activity,
  closeDialog,
}: DialogContentProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["db-users"],
    queryFn: listUsersAdmin,
  });

  const form = useForm<ActivityEdit>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: arktypeResolver(activityEditSchema),
    defaultValues: {
      name: activity.name,
      startAt: new Date(activity.startAt),
      endAt: new Date(activity.endAt),
      activityType: activity.activityType as ActivityType,
      nParticipants: activity.nParticipants,
      participants: activity.participants?.map((p: any) => ({
        id: p.userId,
        type: p.type as ParticipantType,
        hours: p.hours,
      })) || [],
    },
  });

  const {
    fields: participants,
    append: addParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const onSubmit = async (data: ActivityEdit) => {
    const { success, message } = await updateActivity(data, activity.id);
    if (success) {
      toast.success("Actividad actualizada exitosamente", {
        description: `Se ha actualizado la actividad ${data.name} correctamente`,
      });
      closeDialog();
    } else {
      toast.error("Error al actualizar actividad", {
        description: message as string,
      });
    }
  };

  return (
    <DialogContent className="min-w-md">
      <DialogHeader>
        <DialogTitle>Editar actividad</DialogTitle>
        <DialogDescription>
          Ingresar datos para realizar cambios en la actividad
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <FormInput label="Nombre" control={form.control} name="name" />
          <FormSelect label="Tipo" control={form.control} name="activityType">
            {Object.values(ActivityType).map((type) => (
              <SelectItem value={type} key={type}>
                {type.toLowerCase().replaceAll("_", " ")}
              </SelectItem>
            ))}
          </FormSelect>
          <FieldSeparator />
          <div className="flex flex-1 gap-2">
            <Controller
              name="startAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel>Fecha de inicio</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        aria-invalid={fieldState.invalid}
                        value={field.value?.toLocaleDateString("es-CL")}
                      />
                      <InputGroupAddon align="inline-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="ghost">
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              selected={field.value}
                              onSelect={field.onChange}
                              mode="single"
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="endAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel>Fecha de fin</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        aria-invalid={fieldState.invalid}
                        value={field.value?.toLocaleDateString("es-CL")}
                      />
                      <InputGroupAddon align="inline-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="ghost">
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              selected={field.value}
                              onSelect={field.onChange}
                              mode="single"
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <FieldSeparator />

          <FieldSet className="w-full">
            <div className="flex justify-between gap-2 items-center">
              <FieldContent>
                <FieldLegend variant="label" className="mb-0">
                  Participantes
                </FieldLegend>
                <FieldDescription>
                  Ingresar los particpantes de la actividad y su rol
                </FieldDescription>
                {form.formState.errors.participants?.root && (
                  <FieldError
                    errors={[form.formState.errors.participants.root]}
                  />
                )}
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addParticipant({
                    id: "",
                    type: ParticipantType.AUTOR,
                    hours: 0,
                  })
                }
              >
                Agregar
              </Button>
            </div>
            <FieldGroup>
              {participants.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={`tr-${participant.id || index}`}>
                        <TableCell>
                          {isLoading && <Spinner />}
                          {users && (
                            <FormSelect
                              control={form.control}
                              name={`participants.${index}.id`}
                            >
                              {users.map((user) => {
                                // Filter out already selected users, EXCEPT the current one (to allow keeping current selection)
                                const isSelected = participants.some(
                                  (p, idx) => p.id === user.id && idx !== index
                                );
                                if (isSelected) return null;
                                return (
                                  <SelectItem value={user.id} key={user.id}>
                                    {user.name}
                                  </SelectItem>
                                );
                              })}
                            </FormSelect>
                          )}
                        </TableCell>
                        <TableCell>
                          <FormSelect
                            control={form.control}
                            name={`participants.${index}.type`}
                          >
                            {Object.values(ParticipantType).map((type) => (
                              <SelectItem value={type} key={type}>
                                {type.toLowerCase().replaceAll("_", " ")}
                              </SelectItem>
                            ))}
                          </FormSelect>
                        </TableCell>
                        <TableCell>
                          <FormNumberInput
                            control={form.control}
                            name={`participants.${index}.hours`}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeParticipant(index)}
                            aria-label={`Remove Participant ${index + 1}`}
                          >
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
        <DialogFooter className="gap-6 mt-6">
          <DialogClose onClick={() => form.reset()} asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
