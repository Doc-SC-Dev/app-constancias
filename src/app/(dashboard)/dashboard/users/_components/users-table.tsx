"use client";

import { LazyCreateUserDialog } from "@/components/dyamic-dialogs";
import { LazyDataTable } from "@/components/dynamic-table";
import type { User } from "@/lib/types/users";
import { listUsers } from "../actions";
import { columns } from "./colums";

export function UsersTable() {
  return (
    <LazyDataTable<User>
      emptyTitle="No hay usuarios"
      emptyDescription="No hay usuarios disponibles. Para iniciar debe crear un usuario"
      createDialog={LazyCreateUserDialog}
      columns={columns}
      queryKey="list-users"
      queryFn={listUsers}
      placeholder="Filtrar por Nombre, Rol, Email y RUT"
      containerClassName="max-h-full"
    />
  );
}
