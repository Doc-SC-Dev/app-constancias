"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  CircleQuestionMark,
  Info,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  type FieldErrors,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormNumberInput } from "@/components/form/form-number-input";
import { TableError } from "@/components/form/table-error";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { admin, useSession } from "@/lib/auth/better-auth/client";
import {
  type ActivityCreateDTO,
  activityCreateSchema,
} from "@/lib/types/activity";
import { formatDate } from "@/lib/utils";
import { listUsersAdmin } from "../../users/actions";
import { createActivity, getActivityTypes } from "../actions";
import { UserSelect } from "./user-select";

export default function CreateActivityDialog() {
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

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<ActivityCreateDTO>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: arktypeResolver(activityCreateSchema),
    defaultValues: {
      name: "",
      date: { to: undefined, from: new Date() },
      type: "",
      participants: [],
    },
  });

  const activityType = form.watch("type");
  const watchedParticipants = form.watch("participants");

  const {
    fields: participants,
    append: addParticipant,
    remove: removeParticipant,
    replace: replaceParticipants,
  } = useFieldArray({ control: form.control, name: "participants" });

  const selectedActivityType = activityTypes?.find(
    (t) => t.id === activityType,
  );

  /**
   * Returns the count of participants already using the given participantTypeId,
   * optionally excluding a specific row index (used when checking within a row).
   */
  const countByType = (typeId: string, excludeIndex?: number): number =>
    watchedParticipants.filter(
      (p, i) => p.type === typeId && i !== excludeIndex,
    ).length;

  /**
   * Returns true when adding one more participant of this type would exceed max.
   * max === null or max === 0 means unlimited.
   */
  const isTypeAtMax = (typeId: string, excludeIndex?: number): boolean => {
    const pType = selectedActivityType?.participantTypes.find(
      (pt) => pt.id === typeId,
    );
    if (!pType) return false;
    const max = pType.max;
    if (!max || max <= 0) return false;
    return countByType(typeId, excludeIndex) >= max;
  };

  /** True when every participant type has reached its maximum */
  const allTypesAtMax: boolean =
    !!selectedActivityType &&
    selectedActivityType.participantTypes.length > 0 &&
    selectedActivityType.participantTypes.every((pt) => isTypeAtMax(pt.id));

  useEffect(() => {
    if (!activityType) {
      replaceParticipants([]);
      return;
    }

    const activityConfig = activityTypes?.find(
      (aType) => aType.id === activityType,
    );
    if (activityConfig) {
      const initialParticipants = activityConfig.participantTypes
        .filter((p) => p.min > 0)
        .flatMap<ActivityCreateDTO["participants"][0]>((p) =>
          Array.from({ length: p.min }, () => ({
            id: "",
            type: p.id,
            hours: 0,
            bloqueado: true,
          })),
        );

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
      setOpen(false);
    } else {
      toast.error("Error al crear actividad", {
        description: message as string,
      });
    }
  };

  const { data: session, isPending } = useSession();

  const [canCreate, setCanCreate] = useState<boolean>(false);

  useEffect(() => {
    const checkPermision = async () => {
      const { data } = await admin.hasPermission({
        userId: session?.user.id,
        permissions: {
          activity: ["create"],
        },
      });
      if (data?.success) setCanCreate(true);
      else setCanCreate(false);
    };

    checkPermision();
  });
  if (isPending) return <Spinner />;
  if (!canCreate) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="default">
          <Plus />
          Crear actividad
        </Button>
      </DialogTrigger>
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
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="flex items-center">
                      Fecha{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleQuestionMark size="13" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex items-center font-normal gap-2">
                            <Info size="12" color="yellow" />
                            <p>
                              Se puede seleccionar una fecha o un rango de
                              fechas.
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        aria-invalid={fieldState.invalid}
                        value={
                          field.value.to
                            ? `${formatDate(field.value.from)} - ${formatDate(field.value.to)}`
                            : formatDate(field.value.from)
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

                                if (
                                  field.value.to !== undefined &&
                                  value.to !== undefined &&
                                  field.value.to >= value.to
                                ) {
                                  field.onChange({
                                    from: value.to,
                                    to: undefined,
                                  });
                                  return;
                                }
                                const from = value.from ?? new Date();
                                const to =
                                  value.to === undefined
                                    ? undefined
                                    : value.to.toLocaleDateString("es-CL") ===
                                        from.toLocaleDateString("es-CL")
                                      ? undefined
                                      : value.to;

                                field.onChange({
                                  from: value.from,
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
                    Ingresar los participantes de la actividad y su rol
                  </FieldDescription>
                </FieldContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!activityType || allTypesAtMax}
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
                <TableError
                  errors={
                    form.formState.errors
                      .participants as unknown as FieldErrors[]
                  }
                />
                {participants.length > 0 && (
                  <div className="max-h-[200px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-background">
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
                                  hideError={true}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <FormSelect
                                hideError={true}
                                control={form.control}
                                name={`participants.${index}.type`}
                                disabled={participant.bloqueado}
                              >
                                {selectedActivityType?.participantTypes.map(
                                  (participantType) => {
                                    const atMax = isTypeAtMax(
                                      participantType.id,
                                      index,
                                    );
                                    return (
                                      <SelectItem
                                        value={participantType.id}
                                        key={participantType.id}
                                        disabled={atMax}
                                      >
                                        {participantType.min > 0 && (
                                          <b className="text-red-500">*</b>
                                        )}{" "}
                                        {participantType.name}
                                        {atMax && " (máx. alcanzado)"}
                                      </SelectItem>
                                    );
                                  },
                                )}
                              </FormSelect>
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                control={form.control}
                                name={`participants.${index}.hours`}
                                hideError={true}
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
                  </div>
                )}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
          <DialogFooter className="gap-6 mt-6">
            <DialogClose onClick={() => form.reset()} asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner />}
              {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
