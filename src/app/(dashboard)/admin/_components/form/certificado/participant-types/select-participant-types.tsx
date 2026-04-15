"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getParticipantTypes } from "@/app/(dashboard)/admin/actions";
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
import type {
  CertificateCreateDto,
  ListParticipantType,
} from "@/lib/types/certificate";

export default function SelectParticipantTypes() {
  const anchor = useComboboxAnchor();
  const { control, watch } = useFormContext<CertificateCreateDto>();
  const activities = watch("activityTypes");
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "get-list-participant-types",
      activities ? activities.map((a) => a.id).join(",") : "",
    ],
    queryFn: async () => await getParticipantTypes(activities.map((a) => a.id)),
    enabled: !!activities && activities.length > 0,
  });

  const items = useMemo(() => data || [], [data]);
  if (isError) return "Error al cargar los tipos de actividad";

  const templateLocation = watch("templateLocation");

  if (templateLocation !== "participant") return null;
  return (
    <Controller
      control={control}
      name="participantTypes"
      defaultValue={[]}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="combobox-pt">Tipos de participantes</FieldLabel>
          <Combobox
            id="combobox-pt"
            items={items}
            multiple
            autoHighlight
            value={field.value}
            onValueChange={field.onChange}
          >
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {field.value?.map((item) => (
                  <ComboboxChip key={`combobox-chip-${item.id}`}>
                    {item.name}
                  </ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput placeholder="Selecciona tipos de participantes" />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>
                No se encontraron tipos de participantes
              </ComboboxEmpty>
              <ComboboxList>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="mr-4" />
                    Cargando tipos de participantes
                  </div>
                ) : (
                  (item: ListParticipantType) => (
                    <ComboboxItem
                      key={item.id}
                      value={item}
                      disabled={
                        field.value?.filter((pt) => pt.id === item.id).length >
                        0
                      }
                    >
                      {item.name}
                    </ComboboxItem>
                  )
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
