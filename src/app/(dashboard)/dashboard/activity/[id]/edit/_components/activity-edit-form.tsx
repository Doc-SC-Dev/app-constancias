"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { listUsersAdmin } from "@/app/(dashboard)/dashboard/users/actions";
import { FormSelect } from "@/components/form/FormSelect";
import { FormNumberInput } from "@/components/form/form-number-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
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
import type { Activity, ActivityUpdateType } from "@/lib/types/activity";
import { getActivityTypes, updateActivity } from "../../../actions";

export default function ActivityEditForm({
  data,
  title,
  backTo,
  type,
}: {
  data: Activity;
  title: ReactNode;
  backTo: ReactNode;
  type: ReactNode;
}) {
  const router = useRouter();
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
  const form = useForm<ActivityUpdateType>({
    defaultValues: {
      date: { from: data.startAt, to: data.endAt ? data.endAt : undefined },
      participants: data.participants.map((participant) => ({
        id: participant.userId,
        type: participant.typeId,
        hours: participant.hours,
      })),
    },
  });

  const {
    fields: participants,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "participants",
  });
  // TODO: implementar edicion de las actividades
  const [open, setOpen] = useState(false);
  const onSubmit = async (updatedData: ActivityUpdateType) => {
    const { date, participants } = updatedData;
    const { success, message } = await updateActivity(
      {
        activityType: data.typeId,
        name: data.name,
        participants,
        startAt: date.from,
        endAt: date.to,
        nParticipants: participants.length,
      },
      data.id,
    );

    if (success) {
      toast.success(message);
      router.replace(`/dashboard/activity/${data.id}`);
    } else {
      toast.error(message);
    }
  };
  return (
    <Card className="h-full w-full">
      <form className="h-full w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="flex items-center justify-between">
          {backTo}
          <Button
            variant="default"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {!form.formState.isSubmitting && <Save />}
            Guardar
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-6">
            {title}
            <div className="flex gap-4">{type}</div>
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <Field {...field} orientation="horizontal">
                  <span className="font-medium text-sm text-muted-foreground">
                    Periodo
                  </span>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        id="date"
                        className="font-normal"
                        aria-invalid={fieldState.isValidating}
                      >
                        {field.value
                          ? field.value.to
                            ? `${field.value.from.toLocaleDateString("es-CL")} - ${field.value.to.toLocaleDateString("es-CL")}`
                            : field.value.from
                              ? field.value.from.toLocaleDateString("es-CL")
                              : "Seleccionar fecha"
                          : "Seleccionar fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          const from = date?.from ? date.from : new Date();
                          const to = date?.to ? date.to : undefined;
                          if (
                            from.toLocaleDateString("es-CL") ===
                            to?.toLocaleDateString("es-CL")
                          ) {
                            field.onChange({
                              from,
                              to: undefined,
                            });
                          } else {
                            field.onChange({
                              from,
                              to,
                            });
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <FieldSet className="w-full">
            <div className="flex justify-between gap-2 items-center">
              <FieldContent>
                <FieldLegend variant="label" className="mb-0">
                  Participantes
                </FieldLegend>
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
                  append({
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
                            <FormSelect
                              control={form.control}
                              name={`participants.${index}.id`}
                            >
                              {users.map((user) => {
                                if (participants.find((p) => p.id === user.id))
                                  return null;
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
                            {isLoadingActivityTypes && <Spinner />}
                            {activityTypes
                              ?.find((type) => type.id === data.typeId)
                              ?.participantTypes.map((participantType) => (
                                <SelectItem
                                  value={participantType.id}
                                  key={participantType.id}
                                >
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
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
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
        </CardContent>
      </form>
    </Card>
  );
}
