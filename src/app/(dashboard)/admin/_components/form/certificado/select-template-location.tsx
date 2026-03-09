"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CertificateCreateDto } from "@/lib/types/certificate";

export default function SelectTemplateLocation() {
  const { control } = useFormContext<CertificateCreateDto>();
  return (
    <Controller
      control={control}
      name="templateLocation"
      render={({ field, fieldState }) => {
        return (
          <FieldSet>
            <FieldLegend>
              Criterio de asignación de plantilla para el certificado
            </FieldLegend>
            <FieldDescription>
              Defina el criterio que determinará la plantilla utilizada para
              generar el certificado. Según la opción seleccionada, el sistema
              asignará automáticamente la plantilla correspondiente al rol del
              usuario, al tipo de actividad asociada o al tipo de participantes
              registrados en el proceso.
            </FieldDescription>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              orientation="horizontal"
              className="flex flex-row"
            >
              {[
                { value: "role", label: "Rol" },
                { value: "activity", label: "Actividad" },
                { value: "participant", label: "Participante" },
              ].map((option) => (
                <FieldLabel
                  key={option.value}
                  htmlFor={`form-radiogroup-${option.value}`}
                >
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`form-radiogroup-${option.value}`}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldContent>
                      <FieldTitle>{option.label}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        );
      }}
    />
  );
}
