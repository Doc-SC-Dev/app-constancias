"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { type } from "arktype";
import { Check, Plus, X } from "lucide-react";
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
import { Textos } from "@/lib/utils";
import { auditedCreateParticipantType } from "../actions";

// Los roles disponibles en la plataforma (excluyendo SUPERADMIN)
const AVAILABLE_ROLES = ["STUDENT", "PROFESSOR"] as const;

const createParticipantTypeSchema = type({
  name: type.string
    .moreThanLength(0)
    .lessThanLength(100)
    .configure({
      message: (ctx) => {
        if (ctx.code === "minLength")
          return "El nombre debe tener al menos 1 caracter";
        if (ctx.code === "maxLength")
          return "El nombre debe tener menos de 100 caracteres";
        return ctx.problem;
      },
    }),
  required: type.boolean,
  roles: type("'STUDENT' | 'PROFESSOR'")
    .array()
    .atLeastLength(1)
    .configure({
      message: (ctx) => {
        if (ctx.code === "minLength") return "Debe seleccionar al menos un rol";
        return ctx.problem;
      },
    }),
});

export type CreateParticipantTypeForm =
  typeof createParticipantTypeSchema.infer;

export default function CreateParticipantTypeSheet({
  activityTypeId,
}: {
  activityTypeId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateParticipantTypeForm>({
    resolver: arktypeResolver(createParticipantTypeSchema),
    reValidateMode: "onSubmit",
    mode: "onChange",
    defaultValues: {
      name: "",
      required: false,
      roles: [],
    },
  });

  const onSubmit = async (data: CreateParticipantTypeForm) => {
    const result = await auditedCreateParticipantType({
      ...data,
      activityTypeId,
    });

    if (!result.isSuccess && result.error) {
      toast.error("Error al crear el tipo de participante", {
        description: result.error as string,
      });
      return;
    }

    toast.success("Tipo de participante creado", {
      description: `Se creó "${data.name}" correctamente.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        setOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Añadir tipo de participante
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuevo tipo de participante</SheetTitle>
          <SheetDescription>
            Define el nombre, si es obligatorio y los roles que pueden tomar
            este tipo de participación en las actividades.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-4 py-4"
          >
            <FieldGroup>
              {/* Campo: Nombre */}
              <FormInput
                label="Nombre"
                control={form.control}
                name="name"
                description="Nombre con el que se identificará este tipo de participante (ej: Expositor, Asistente, Moderador)"
                placeholder="Nombre del tipo de participante"
              />

              {/* Campo: Obligatorio (Switch) */}
              <Controller
                control={form.control}
                name="required"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Obligatorio</FieldTitle>
                      <FieldDescription>
                        Si está activo, toda actividad de este tipo deberá tener
                        al menos un participante con este rol.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              {/* Campo: Roles (Checkboxes) */}
              <Controller
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLabel>Roles permitidos</FieldLabel>
                    <FieldDescription>
                      Selecciona qué roles de usuario pueden tomar este tipo de
                      participación.
                    </FieldDescription>
                    <div className="flex flex-col gap-3 mt-2">
                      {AVAILABLE_ROLES.map((role) => {
                        const checkboxId = `role-checkbox-${role}`;
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
                              {Textos.Role[role]}
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

            <SheetFooter className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" variant="outline">
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
  );
}
