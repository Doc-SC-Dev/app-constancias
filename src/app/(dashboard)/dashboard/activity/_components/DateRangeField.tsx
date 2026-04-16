"use client";

import { CalendarIcon, CircleQuestionMark, Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ActivityCreateDTO } from "@/lib/types/activity";
import { formatDate } from "@/lib/utils";

export function DateRangeField() {
  const { control } = useFormContext<ActivityCreateDTO>();
  return (
    <Controller
      name="date"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel className="flex items-center">
              Fecha{" "}
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark size="13" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center font-normal gap-2">
                    <Info size="12" color="yellow" />
                    <p>Se puede seleccionar una fecha o un rango de fechas.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                aria-invalid={fieldState.invalid}
                value={
                  field.value.to
                    ? `${formatDate(field.value.from)} - ${formatDate(field.value.to)}`
                    : formatDate(field.value.from)
                }
              />
              <InputGroupAddon align="inline-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="ghost">
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      selected={field.value}
                      onSelect={(value) => {
                        if (value === undefined) {
                          field.onChange({ from: new Date(), to: undefined });
                          return;
                        }

                        if (
                          field.value.to !== undefined &&
                          value.to !== undefined &&
                          field.value.to >= value.to
                        ) {
                          field.onChange({ from: value.to, to: undefined });
                          return;
                        }

                        const from = value.from ?? new Date();
                        const to =
                          value.to === undefined
                            ? undefined
                            : value.to.toLocaleDateString("es-CL") ===
                                from.toLocaleDateString("es-CL")
                              ? undefined
                              : value.to;

                        field.onChange({ from: value.from, to });
                      }}
                      mode="range"
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
