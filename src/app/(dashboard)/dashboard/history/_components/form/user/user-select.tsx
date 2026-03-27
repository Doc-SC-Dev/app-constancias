"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { getNotAdminUsers } from "@/app/(dashboard)/action";
import { FormSelect } from "@/components/form/FormSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreateRequest } from "@/lib/types/request";

export default function UserSelect() {
  const form = useFormContext<CreateRequest>();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-none-admin-user"],
    queryFn: getNotAdminUsers,
  });

  if (isLoading) return <Skeleton className="h-2 w-1/3 bg-muted" />;

  if (!users || !users.isSuccess || error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error de carga de usuarios</AlertTitle>
        <AlertDescription>
          {error?.message ||
            users?.error ||
            "Ocurrio un error durante la carga de usuario intente nuevamente."}
        </AlertDescription>
      </Alert>
    );

  return (
    <FormSelect
      control={form.control}
      name="userId"
      label="Usuario"
      description="Seleccione el usuario al que desea crear una solicitud"
    >
      {users.value.map((user) => (
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
