"use client";

import { useCallback } from "react";
import { LazyCreateUserDialog } from "@/components/dyamic-dialogs";
import { LazyDataTable } from "@/components/dynamic-table";
import type { Role } from "@/lib/authorization/permissions";
import type { User } from "@/lib/types/users";
import { listUsers } from "../actions";
import { columns } from "./colums";

export function UsersTable({ userRole }: { userRole: Role }) {
  const CreateDialog = useCallback(
    () => <LazyCreateUserDialog userRole={userRole} />,
    [userRole],
  );
  return (
    <LazyDataTable<User>
      emptyTitle="No hay usuarios"
      emptyDescription="No hay usuarios disponibles. Para iniciar debe crear un usuario"
      createDialog={CreateDialog}
      columns={columns}
      queryKey="list-users"
      queryFn={listUsers}
      placeholder="Filtrar por Nombre, Rol, Email y RUT"
      containerClassName="max-h-full"
    />
  );
}
