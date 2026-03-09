"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Roles } from "@/lib/authorization/permissions";
import type { CertificateCreateDto } from "@/lib/types/certificate";
import { Textos } from "@/lib/utils";

export default function SelectRole() {
  const { control, watch } = useFormContext<CertificateCreateDto>();
  const templateLocation = watch("templateLocation");
  if (templateLocation !== "role") {
    return "";
  }
  return (
    <Controller
      control={control}
      name="roles"
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">Roles</FieldLegend>
          <FieldDescription>
            Seleccione los roles para los cuales se generará el certificado.
          </FieldDescription>
          <FieldGroup
            data-slot="checkbox-group"
            className="flex flex-row w-fit"
          >
            {[Roles.STUDENT, Roles.PROFESSOR].map((role) => (
              <Field
                key={`field-checkbox-for-${role}`}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="w-fit"
              >
                <Checkbox
                  id={`checkbox-for-role-${role}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={
                    field.value?.find((r) => r.name === role) !== undefined
                  }
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(field.value ?? []), { name: role, template: "" }]
                      : field.value?.filter((value) => value.name !== role);
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel
                  htmlFor={`checkbox-for-role-${role}`}
                  className="font-normal"
                >
                  {Textos.Role[role]}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
