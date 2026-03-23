"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { getAvailableCertificates } from "@/app/(dashboard)/action";
import { FormSelect } from "@/components/form/FormSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreateRequest } from "@/lib/types/request";

export default function CertificateSelect() {
  const { control, watch } = useFormContext<CreateRequest>();
  const userId = watch("userId");

  const { data, error, isLoading } = useQuery({
    queryKey: ["get-available-certificates", userId],
    queryFn: () =>
      getAvailableCertificates({
        userId,
      }),
  });
  if (!userId) return null;

  if (isLoading) return <Skeleton className="h-2 w-1/3 bg-muted" />;

  if (!data) return null;

  if (error || !data.isSuccess) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error al cargar certificados</AlertTitle>
        <AlertDescription>
          {data.error ||
            error?.message ||
            "Hubo un error cuando se intentaron cargar los certificados."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FormSelect
      control={control}
      name="certificateName"
      label="Tipo de constancia"
      description="Selecciona el tipo de constancia que deseas solicitar."
    >
      {data.value.map((certificate) => {
        return (
          <SelectItem key={certificate.id} value={certificate.name}>
            {certificate.name}
          </SelectItem>
        );
      })}
    </FormSelect>
  );
}
