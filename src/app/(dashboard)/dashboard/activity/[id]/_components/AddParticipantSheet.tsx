"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { listUsersAdmin } from "@/app/(dashboard)/dashboard/users/actions";
import { FormSelect } from "@/components/form/FormSelect";
import { FormNumberInput } from "@/components/form/form-number-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type { Roles } from "@/lib/authorization/permissions";
import { addParticipantToActivity, getActivityTypes } from "../../actions";

interface AddParticipantSheetProps {
  activityId: string;
  activityTypeId: string;
  existingParticipantIds: string[];
}

export default function AddParticipantSheet({
  activityId,
  activityTypeId,
  existingParticipantIds,
}: AddParticipantSheetProps) {
  const [open, setOpen] = useState(false);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
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

  const participantTypes =
    (
      activityTypes as Array<{
        id: string;
        participantTypes: Array<{
          id: string;
          name: string;
          roles: (Roles.PROFESSOR | Roles.STUDENT)[];
        }>;
      }>
    )?.find((t) => t.id === activityTypeId)?.participantTypes || [];

  const form = useForm({
    defaultValues: {
      userId: "",
      participantTypeId: "",
      hours: 1,
    },
  });

  const onSubmit = async (data: {
    userId: string;
    participantTypeId: string;
    hours: number;
  }) => {
    if (!data.userId || !data.participantTypeId || data.hours < 1) {
      toast.error("Por favor completa todos los campos correctamente.");
      return;
    }

    const { isSuccess, value, error } = await addParticipantToActivity(
      activityId,
      data,
    );

    if (isSuccess) {
      toast.success(value);
      setOpen(false);
      form.reset();
    } else {
      toast.error(error);
    }
  };
  const watchedUser = users?.find((u) => u.id === form.watch("userId"));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Participante
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Añadir Participante</SheetTitle>
          <SheetDescription>
            Busca un usuario y asígnale un rol en esta actividad.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 m-4"
        >
          <FieldGroup>
            <FormSelect
              label="Usuario"
              description="Seleccione usuario que va a participar en la actividad"
              control={form.control}
              name="userId"
              disabled={isLoadingUsers}
            >
              {users
                ?.filter((u) => !existingParticipantIds.includes(u.id))
                .map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
            </FormSelect>

            <FormSelect
              label="Tipo de Participante"
              description="Seleccione en que capacidad el usuario va a participar en la actividad"
              control={form.control}
              name="participantTypeId"
              disabled={isLoadingActivityTypes}
            >
              {!watchedUser && (
                <SelectItem value="0" disabled>
                  Seleccione un usuario para ver los roles que se le pueden
                  asignar.
                </SelectItem>
              )}
              {participantTypes
                .filter((pt) =>
                  pt.roles.includes(
                    watchedUser?.role as Roles.PROFESSOR | Roles.STUDENT,
                  ),
                )
                .map((pt: { id: string; name: string }) => (
                  <SelectItem key={pt.id} value={pt.id}>
                    {pt.name}
                  </SelectItem>
                ))}
            </FormSelect>

            <FormNumberInput
              control={form.control}
              name="hours"
              label="Horas"
              description="Ingrese la cantidad de horas que el usuario va a participar en la actividad."
            />
          </FieldGroup>

          <SheetFooter className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline" type="button">
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Spinner className="mr-1" /> Guardando
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Añadir
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
