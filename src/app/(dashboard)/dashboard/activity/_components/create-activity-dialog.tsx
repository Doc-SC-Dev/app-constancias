"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
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
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  type ActivityCreateDTO,
  activityCreateSchema,
} from "@/lib/types/activity";
import { listUsersAdmin } from "../../users/actions";
import { useParticipantConstraints } from "../_hooks/useParticipantConstraints";
import { createActivity, getActivityTypes } from "../actions";
import { DateRangeField } from "./DateRangeField";
import { ParticipantsFieldSet } from "./ParticipantsFieldset";

export default function CreateActivityDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: users, isLoading } = useQuery({
    queryKey: ["db-users"],
    queryFn: listUsersAdmin,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  const { data: activityTypes, isLoading: isLoadingActivityTypes } = useQuery({
    queryKey: ["db-activity-types"],
    queryFn: getActivityTypes,
    refetchOnWindowFocus: false,
    enabled: open,
  });

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

  const { selectedActivityType, isTypeAtMax, allTypesAtMax } =
    useParticipantConstraints({
      activityType,
      activityTypes,
      replaceParticipants,
      watchedParticipants,
    });

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
          <FormProvider {...form}>
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
              <DateRangeField />

              <FieldSeparator />
              <ParticipantsFieldSet
                participants={participants}
                participantTypes={selectedActivityType?.participantTypes || []}
                users={users}
                isLoadingUsers={isLoading}
                allTypesAtMax={allTypesAtMax}
                activityTypeSelected={!!activityType}
                errors={
                  form.formState.errors.participants as unknown as FieldErrors[]
                }
                isTypeAtMax={isTypeAtMax}
                onAdd={() =>
                  addParticipant({
                    id: "",
                    type: "",
                    hours: 0,
                    bloqueado: false,
                  })
                }
                onRemove={removeParticipant}
              />
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
          </FormProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
}
