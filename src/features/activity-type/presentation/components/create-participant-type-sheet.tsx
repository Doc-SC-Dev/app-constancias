"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import type { Role } from "@/lib/authorization/permissions";
import { Textos } from "@/lib/utils";
import {
  type CreateParticipantTypeForm,
  CreateParticipantTypeSchema,
} from "../../infrastructure/activity-type.schema";
import { createParticipantTypeAction } from "../actions";

const AVAILABLE_ROLES: Role[] = ["STUDENT", "PROFESSOR"];

export default function CreateParticipantTypeSheet({
  activityTypeId,
}: {
  activityTypeId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateParticipantTypeForm>({
    resolver: arktypeResolver(CreateParticipantTypeSchema),
    reValidateMode: "onSubmit",
    mode: "onChange",
    defaultValues: {
      activityTypeId,
      name: "",
      required: false,
      roles: [],
    },
  });

  const onSubmit = async (data: CreateParticipantTypeForm) => {
    const result = await createParticipantTypeAction(data);

    if (!result.isSuccess && result.error) {
      toast.error("Error al crear el tipo de participante", {
        description: result.error,
      });
      return;
    }

    toast.success("Tipo de participante creado", {
      description: `"${data.name}" se creó correctamente.`,
    });
    setOpen(false);
    form.reset();
  };

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
          <SheetTitle>Nuevo tipo de participante</SheetTitle>
          <SheetDescription>
            Configura un nuevo rol de participación para este tipo de actividad.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-4 py-4"
          >
            <FieldGroup>
              <FormInput
                label="Nombre"
                control={form.control}
                name="name"
                description="Ej: Expositor, Asistente, Coordinador"
                placeholder="Nombre del tipo de participante"
              />

              <Controller
                control={form.control}
                name="required"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Obligatorio</FieldTitle>
                      <FieldDescription>
                        ¿Es indispensable para registrar la actividad?
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLabel>Roles permitidos</FieldLabel>
                    <FieldDescription>
                      ¿Qué tipo de usuarios pueden tener este rol?
                    </FieldDescription>
                    <div className="flex flex-col gap-3 mt-2">
                      {AVAILABLE_ROLES.map((role) => {
                        const isChecked = field.value.includes(role);
                        return (
                          <div key={role} className="flex items-center gap-3">
                            <Checkbox
                              id={`role-${role}`}
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
                              htmlFor={`role-${role}`}
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
                  </FieldSet>
                )}
              />
            </FieldGroup>

            <SheetFooter>
              <Button type="submit" className="w-full">
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="mr-2" /> Guardando
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Crear Participante
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
