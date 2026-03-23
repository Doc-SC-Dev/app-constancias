"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Check, InfinityIcon, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
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
import { Roles } from "@/lib/authorization/permissions";
import { Textos } from "@/lib/utils";
import {
  type UpdateParticipantTypeForm,
  UpdateParticipantTypeSchema,
} from "../../infrastructure/activity-type.schema";
import {
  deleteParticipantTypeAction,
  updateParticipantTypeAction,
} from "../actions";

const AVAILABLE_ROLES: ("STUDENT" | "PROFESSOR")[] = [
  Roles.STUDENT,
  Roles.PROFESSOR,
];

type ParticipantTypeActionsProps = {
  participantTypeId: string;
  activityTypeId: string;
  currentName: string;
  currentRoles: ("STUDENT" | "PROFESSOR")[];
  currentMin: number;
  currentMax: number | null;
};

export default function ParticipantTypeActions({
  participantTypeId,
  activityTypeId,
  currentName,
  currentRoles,
  currentMin,
  currentMax,
}: ParticipantTypeActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateParticipantTypeForm>({
    resolver: arktypeResolver(UpdateParticipantTypeSchema),
    reValidateMode: "onSubmit",
    mode: "onChange",
    defaultValues: {
      id: participantTypeId,
      activityTypeId,
      name: currentName,
      roles: currentRoles as ("STUDENT" | "PROFESSOR")[],
      min: currentMin,
      max: currentMax,
    },
  });

  const onSubmit = async (data: UpdateParticipantTypeForm) => {
    const result = await updateParticipantTypeAction(data);

    if (!result.isSuccess && result.error) {
      toast.error("Error al actualizar el tipo de participante", {
        description: result.error,
      });
      return;
    }

    toast.success("Tipo de participante actualizado", {
      description: `"${data.name}" se actualizó correctamente.`,
    });
    setEditOpen(false);
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const result = await deleteParticipantTypeAction(
      participantTypeId,
      activityTypeId,
    );
    setIsDeleting(false);

    if (!result.isSuccess && result.error) {
      toast.error("Error al eliminar el tipo de participante", {
        description: result.error,
      });
      return;
    }

    toast.success("Tipo de participante eliminado correctamente.");
  };

  return (
    <div className="flex items-center gap-1">
      <Sheet
        open={editOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) form.reset();
          setEditOpen(isOpen);
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar tipo de participante</SheetTitle>
            <SheetDescription>
              Modifica el nombre, obligatoriedad y roles de este tipo de
              participante.
            </SheetDescription>
          </SheetHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 px-4"
            >
              <FieldGroup>
                <FormInput
                  label="Nombre"
                  control={form.control}
                  name="name"
                  description="Nombre con el que se identificará este tipo de participante"
                  placeholder="Nombre del tipo de participante"
                />

                <FieldLegend>Cantidad de Participantes</FieldLegend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Mínimo de usos */}
                  <Controller
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Min. Participantes</FieldLabel>
                        <InputGroup>
                          {field.value && field.value > 0 ? (
                            <InputGroupAddon className="bg-[#fa5014]/10 text-[#fa5014] text-[10px] font-bold px-2 border-r border-[#fa5014]/20">
                              REQUERIDO
                            </InputGroupAddon>
                          ) : (
                            <InputGroupAddon className="bg-[#008296]/10 border-r border-[#008296]/20 px-2 text-[10px]">
                              OPCIONAL
                            </InputGroupAddon>
                          )}
                          <InputGroupInput
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </InputGroup>
                        <FieldDescription>0 = Opcional</FieldDescription>
                      </Field>
                    )}
                  />

                  {/* Máximo de usos */}
                  <Controller
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Max. Participantes</FieldLabel>
                        <InputGroup>
                          {!field.value && (
                            <InputGroupAddon className="bg-[#008296]/10 border-r border-[#008296]/20 px-2">
                              <InfinityIcon className="w-3.5 h-3.5 text-[#008296] animate-pulse" />
                            </InputGroupAddon>
                          )}
                          <InputGroupInput
                            type="number"
                            min={0}
                            placeholder="∞ Sin límite"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? null : Number(val));
                            }}
                          />
                        </InputGroup>
                        <FieldDescription>
                          {!field.value ? "Uso ilimitado" : "Límite máximo"}
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="roles"
                  render={({ field, fieldState }) => (
                    <>
                      <FieldLabel>Roles permitidos</FieldLabel>
                      <FieldDescription>
                        Selecciona qué roles de usuario pueden tomar este tipo
                        de participación.
                      </FieldDescription>
                      <div className="flex flex-col gap-3">
                        {AVAILABLE_ROLES.map((role) => {
                          const checkboxId = `edit-role-checkbox-${participantTypeId}-${role}`;
                          const isChecked = field.value.includes(role);
                          return (
                            <div key={role} className="flex items-center gap-3">
                              <Checkbox
                                id={checkboxId}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, role]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((r) => r !== role),
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={checkboxId}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {Textos.Role[role as keyof typeof Textos.Role]}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {fieldState.error && (
                        <p className="text-destructive text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </FieldGroup>

              <SheetFooter className="flex gap-2">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset()}
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner /> Guardando
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Guardar
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            <span className="sr-only">Eliminar</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el tipo de participante{" "}
              <strong>&quot;{currentName}&quot;</strong>. Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={onDelete}>
                Eliminar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
