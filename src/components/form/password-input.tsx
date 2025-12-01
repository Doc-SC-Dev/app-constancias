"use client";
import { Eye, EyeOff, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";

type PasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  forgot?: () => void;
};

export default function PasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  forgot,
}: PasswordInputProps<TFieldValues, TName, TTransformedValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <div className={`flex ${isMobile ? "" : "justify-between"} `}>
              <FieldLabel htmlFor={`field-${field.name}`}>{label}</FieldLabel>
              {forgot && !isMobile && (
                <Button type="button" variant="link" onClick={() => forgot()}>
                  ¿Olvistaste tu contraseña?
                </Button>
              )}
            </div>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const errorElem = fieldState.invalid && fieldState.error && (
          <PasswordChecklist errorMessage={fieldState.error.message} />
        );

        return (
          <>
            <Field data-invalid={fieldState.invalid} orientation="vertical">
              <FieldContent>{labelElement}</FieldContent>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={`field-${field.name}`}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant="ghost"
                    type="button"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errorElem}
            </Field>
            {isMobile && (
              <Button variant="link">¿Olvistaste tu constraseña?</Button>
            )}
          </>
        );
      }}
    />
  );
}

interface PasswordChecklistProps {
  errorMessage?: string;
}

function PasswordChecklist({ errorMessage }: PasswordChecklistProps) {
  if (!errorMessage) return null;

  const errors = errorMessage.split("\n,");

  return (
    <div className="mt-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <p className="font-medium mb-2 flex items-center gap-2">
        <XCircle className="h-4 w-4" />
        Requisitos pendientes:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {errors.map((err, index) => (
          <li key={index.toString()} className="text-destructive font-medium">
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
}
