"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getActivityTypes } from "@/app/(dashboard)/action";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { ActivityType } from "@/lib/types/activity";
import type { CertificateCreateDto } from "@/lib/types/certificate";

export default function SelectActivityType() {
  const anchor = useComboboxAnchor();
  const { data: activityTypes, isLoading } = useQuery({
    queryKey: ["get-list-activity-types"],
    queryFn: getActivityTypes,
  });
  const { control, watch } = useFormContext<CertificateCreateDto>();

  const items = useMemo(() => {
    return activityTypes?.map((at) => ({ id: at.id, name: at.name })) || [];
  }, [activityTypes]);

  const templateLocation = watch("templateLocation");

  if (templateLocation === "role") return null;
  return (
    <Controller
      control={control}
      defaultValue={[]}
      name="activityTypes"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="combobox-at">Tipos de actividades</FieldLabel>
          <Combobox
            id="combobox-at"
            items={items}
            multiple
            autoHighlight
            value={field.value}
            onValueChange={field.onChange}
          >
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {field.value?.map((item) => (
                  <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput placeholder="Seleccionar tipo de actividad" />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Cargando tipos de actividad
                  </>
                ) : (
                  "No se encontraron tipos de actividad"
                )}
              </ComboboxEmpty>
              <ComboboxList>
                {(item: ActivityType) => (
                  <ComboboxItem
                    key={item.id}
                    value={item}
                    disabled={
                      field.value?.filter((at) => at.id === item.id).length > 0
                    }
                  >
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
