"use client";

import { Trash } from "lucide-react";
import {
  Controller,
  type FieldArrayWithId,
  type FieldError as RHFFieldError,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Field,
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
import type { CreateActivityType } from "./create-activity-type-form";

export default function ParticipantTypeField() {
  const { control, formState } = useFormContext<CreateActivityType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participantTypes",
  });
  return (
    <FieldSet className="w-full">
      <div className="flex justify-between gap-2 items-center">
        <FieldContent>
          <FieldLegend variant="label" className="mb-0">
            Tipo de participantes
          </FieldLegend>
          <FieldDescription>
            Ingresar los tipos de participantes que estarán asociados a este
            tipo de actividades y define cuales son requeridos para crear el
            tipo de actividad.
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
        {(formState.errors.participantTypes as RHFFieldError | undefined)
          ?.message && (
          <FieldError
            errors={[
              {
                message:
                  (formState.errors.participantTypes as RHFFieldError)
                    ?.message ?? "",
              },
            ]}
          />
        )}
        {fields.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="container">Nombre</TableHead>
                <TableHead className="container justify-center items-center">
                  ¿Es requerido?
                </TableHead>
                <TableHead className="container justify-center items-center">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((participantType, index) => (
                <TableRow key={`tr-${participantType.id}`}>
                  <TableCell>
                    <FormInput
                      control={control}
                      name={`participantTypes.${index}.name`}
                      hideError={true}
                    />
                  </TableCell>
                  <TableCell>
                    <FormSwitch
                      participantType={participantType}
                      index={index}
                    />
                  </TableCell>
                  <TableCell className="flex justify-center items-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      aria-label={`Remove Participant ${index + 1}`}
                    >
                      <Trash />
                    </Button>
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
type ParticipantTypeField = FieldArrayWithId<
  {
    name: string;
    participantTypes: {
      name: string;
      required: boolean;
    }[];
  },
  "participantTypes",
  "id"
>;
const FormSwitch = ({
  participantType,
  index,
}: {
  participantType: ParticipantTypeField;
  index: number;
}) => {
  const { control } = useFormContext<CreateActivityType>();
  return (
    <Controller
      key={participantType.id}
      control={control}
      name={`participantTypes.${index}.required`}
      render={({ field: controllerField, fieldState }) => {
        return (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid}
            className="container justify-center items-center"
          >
            <Switch
              checked={controllerField.value}
              onCheckedChange={controllerField.onChange}
              aria-invalid={fieldState.invalid}
            />
          </Field>
        );
      }}
    />
  );
};
