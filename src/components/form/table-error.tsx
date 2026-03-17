import { AlertCircle } from "lucide-react";
import type { FieldErrors } from "react-hook-form";

type TableErrorProps = {
  errors: FieldErrors[] | FieldErrors | undefined;
};

export function TableError({ errors }: TableErrorProps) {
  if (!errors) return null;

  if (Array.isArray(errors)) {
    const errorMessages = new Set<string>();

    errors.forEach((rowError) => {
      if (!rowError) return;
      Object.values(rowError).forEach((fieldError) => {
        if (
          fieldError &&
          typeof fieldError === "object" &&
          "message" in fieldError
        ) {
          if (typeof fieldError.message === "string") {
            errorMessages.add(fieldError.message);
          }
        }
      });
    });

    const arrayErrors = errors as typeof errors & {
      root?: { message?: string };
    };

    if (arrayErrors.root?.message) {
      errorMessages.add(arrayErrors.root.message);
    }

    if (errorMessages.size === 0) return null;

    return (
      <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive dark:bg-destructive/10 mb-4">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4" />
          Errores en la tabla:
        </div>
        <ul className="mt-2 list-disc pl-5">
          {Array.from(errorMessages).map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (
    typeof errors === "object" &&
    "message" in errors &&
    typeof errors.message === "string"
  ) {
    return (
      <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive dark:bg-destructive/10 mb-4">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4" />
          {(errors as unknown as { message: string }).message}
        </div>
      </div>
    );
  }

  return null;
}
