"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Trash } from "lucide-react";
import { useEffect } from "react";
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
import {
  type ActivityCreateDTO,
  activityCreateSchema,
} from "@/lib/types/activity";
import { listUsersAdmin } from "../../users/actions";
import { createActivity, getActivityTypes } from "../actions";
import { UserSelect } from "./user-select";

type CreateActivityDialogProps = {
  closeDialog: () => void;
};

export default function CreateActivityDialog({
  closeDialog,
}: CreateActivityDialogProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["db-users"],
    queryFn: listUsersAdmin,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const { data: activityTypes, isLoading: isLoadingActivityTypes } = useQuery({
    queryKey: ["db-activity-types"],
    queryFn: getActivityTypes,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const form = useForm<ActivityCreateDTO>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: arktypeResolver(activityCreateSchema),
    defaultValues: {
      name: "",
      date: { to: undefined, from: new Date() },
      type: "",
      participants: [{ id: "", type: "", hours: 0 }],
    },
  });

  const activityType = form.watch("type");

  const {
    fields: participants,
    append: addParticipant,
    remove: removeParticipant,
    replace: replaceParticipants,
  } = useFieldArray({ control: form.control, name: "participants" });

  useEffect(() => {
    if (!activityType) {
      replaceParticipants([]);
      return;
    }

    const activityConfig = activityTypes?.find(
      (aType) => aType.id === activityType,
    );
    if (activityConfig) {
      const initialParticipants = activityConfig.participantTypes.map<
        ActivityCreateDTO["participants"][0]
      >((p) => ({
        id: "",
        type: p.id,
        hours: 0,
        bloqueado: p.required,
      }));

      replaceParticipants(initialParticipants);
    }
  }, [activityType, replaceParticipants, activityTypes]);

  const onSubmit = async (data: ActivityCreateDTO) => {
    const { success, message } = await createActivity({ activity: data });
    if (success) {
      toast.success("Actividad creada exitosamente", {
        description: `Se ha creado la actividad ${data.name} con ${data.participants.length} participantes de forma exitosa`,
      });
      form.reset();
      closeDialog();
    } else {
      toast.error("Error al crear actividad", {
        description: message as string,
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
      <DialogHeader className="w-full">
        <DialogTitle>Crear Actividad</DialogTitle>
        <DialogDescription>
          Ingresar datos para crear una nueva actividad
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <FormInput label="Nombre" control={form.control} name="name" />
          {isLoadingActivityTypes && <Spinner />}
          {activityTypes && (
            <FormSelect label="Tipo" control={form.control} name="type">
              {activityTypes.map((type) => (
                <SelectItem value={type.id} key={type.id}>
                  {type.name.toLowerCase().replaceAll("_", " ")}
                </SelectItem>
              ))}
            </FormSelect>
          )}
          <FieldSeparator />
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel>Fecha</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      value={
                        field.value.to
                          ? `${field.value.from.toLocaleDateString("es-CL")} - ${field.value.to.toLocaleDateString("es-CL")}`
                          : field.value.from.toLocaleDateString("es-CL")
                      }
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
                            onSelect={(value) => {
                              if (value === undefined) {
                                field.onChange({
                                  from: new Date(),
                                  to: undefined,
                                });
                                return;
                              }
                              const from =
                                value.from === undefined
                                  ? new Date()
                                  : value.from;
                              const to =
                                value.to === undefined
                                  ? undefined
                                  : value.to.toLocaleDateString("es-CL") ===
                                      from.toLocaleDateString("es-CL")
                                    ? undefined
                                    : value.to;
                              field.onChange({
                                from,
                                to,
                              });
                            }}
                            mode="range"
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
                    type: "",
                    hours: 0,
                    bloqueado: false,
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
                      <TableRow key={`tr-${participant.id}`}>
                        <TableCell>
                          {isLoading && <Spinner />}
                          {users && (
                            <UserSelect
                              index={index}
                              fieldName="participants"
                              users={users}
                              control={form.control}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <FormSelect
                            control={form.control}
                            name={`participants.${index}.type`}
                            disabled={participant.bloqueado}
                          >
                            {activityTypes
                              ?.find((type) => type.id === activityType)
                              ?.participantTypes.map((participantType) => (
                                <SelectItem
                                  value={participantType.id}
                                  key={participantType.id}
                                >
                                  {participantType.required && (
                                    <b className="text-red-500">*</b>
                                  )}{" "}
                                  {participantType.name}
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
                          {!participant.bloqueado && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeParticipant(index)}
                              aria-label={`Remove Participant ${index + 1}`}
                            >
                              <Trash />
                            </Button>
                          )}
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
