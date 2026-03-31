"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { InfinityIcon, Plus, Save, X } from "lucide-react";
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
  FieldLegend,
  FieldSet,
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
  type CreateParticipantTypeForm,
  CreateParticipantTypeSchema,
} from "../../infrastructure/activity-type.schema";
import { createParticipantTypeAction } from "../actions";

const AVAILABLE_ROLES: (Roles.STUDENT | Roles.PROFESSOR)[] = [
  Roles.PROFESSOR,
  Roles.STUDENT,
];

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
      roles: [],
      min: 0,
      max: undefined,
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
            className="flex flex-col gap-4 px-4"
          >
            <FieldGroup>
              <FormInput
                label="Nombre"
                control={form.control}
                name="name"
                description="Ej: Expositor, Asistente, Coordinador"
                placeholder="Nombre del tipo de participante"
              />

              <FieldSet>
                <FieldLegend>Cantidad de Participantes</FieldLegend>
                <FieldContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Mínimo de usos */}
                  <Controller
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Min. Participantes</FieldLabel>
                        <InputGroup>
                          {field.value > 0 ? (
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
                              field.onChange(val === "" ? 0 : Number(val));
                            }}
                          />
                        </InputGroup>
                        <FieldDescription>
                          {!field.value ? "Uso ilimitado" : "Límite máximo"}
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </FieldContent>
              </FieldSet>
              <Controller
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLabel>Roles permitidos</FieldLabel>
                    <FieldDescription>
                      ¿Qué tipo de usuarios pueden tener este rol?
                    </FieldDescription>
                    <div className="flex flex-col gap-3">
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

            <SheetFooter className="flex gap-2">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => form.reset()}
                  className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit">
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" /> Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
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
