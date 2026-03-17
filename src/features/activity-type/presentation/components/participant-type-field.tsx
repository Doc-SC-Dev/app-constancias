"use client";

import { Trash } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CreateActivityTypeFormDto } from "../../infrastructure/activity-type.schema";

export default function ParticipantTypeField() {
  const { control, formState } = useFormContext<CreateActivityTypeFormDto>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participantTypes",
  });

  return (
    <FieldSet className="w-full">
      <div className="flex justify-between gap-2 items-center">
        <FieldContent>
          <FieldLegend variant="label" className="mb-0">
            Tipos de participantes
          </FieldLegend>
          <FieldDescription>
            Define los roles que pueden participar en este tipo de actividad.
          </FieldDescription>
        </FieldContent>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              required: true,
            })
          }
        >
          Agregar
        </Button>
      </div>
      <FieldGroup>
        {formState.errors.participantTypes?.message && (
          <FieldError
            errors={[
              { message: String(formState.errors.participantTypes.message) },
            ]}
          />
        )}
        {fields.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">¿Requerido?</TableHead>
                <TableHead className="text-center w-[50px]">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((participantType, index) => (
                <TableRow key={participantType.id}>
                  <TableCell>
                    <FormInput
                      control={control}
                      name={`participantTypes.${index}.name`}
                      hideError={true}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Controller
                        control={control}
                        name={`participantTypes.${index}.required`}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </FieldGroup>
    </FieldSet>
  );
}
