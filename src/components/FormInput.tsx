import type { ReactNode } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label: ReactNode;
  password?: boolean;
  placeholder?: string;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};
export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  label,
  name,
  password,
  placeholder,
}: FormControlProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center">
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {password && (
              <a
                href="/"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            )}
          </div>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            type={password ? "password" : "text"}
            placeholder={placeholder ?? ""}
            required
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
