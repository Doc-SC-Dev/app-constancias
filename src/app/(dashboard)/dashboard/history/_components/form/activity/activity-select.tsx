"use client";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { getAvailableActivities } from "@/app/(dashboard)/action";
import { FormSelect } from "@/components/form/FormSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreateRequest } from "@/lib/types/request";

export default function ActivitySelect() {
  const { control, watch } = useFormContext<CreateRequest>();

  const certificateName = watch("certificateName");

  const { data, error, isLoading } = useQuery({
    queryKey: ["get-available-activities", certificateName],
    queryFn: () =>
      getAvailableActivities({
        certificateName,
      }),
  });

  if (!certificateName || !data || !data.value) return null;
  if (isLoading) return <Skeleton className="h-2 w-1/3 bg-muted" />;
  if (error || !data.isSuccess)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error de carga de actividades</AlertTitle>
        <AlertDescription>
          {error?.message ||
            data?.error ||
            "Ocurrio un error durante la carga de actividades intente nuevamente."}
        </AlertDescription>
      </Alert>
    );

  if (data.value.length === 0) return null;
  return (
    <FormSelect
      control={control}
      name="activityId"
      label="Actividad"
      description="Selecciona la actividad a la que deseas solicitar la constancia."
    >
      {data.value.map((activity) => (
        <SelectItem key={activity.id} value={activity.id}>
          {activity.name}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
