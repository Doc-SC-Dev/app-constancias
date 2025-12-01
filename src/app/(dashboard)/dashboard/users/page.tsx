import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { auth } from "@/lib/auth";
import type { User } from "@/lib/types/users";
import { columns } from "./_components/colums";
import NewUserDialog from "./_components/newuser-dialog";
import { UsersEmpty } from "./_components/users-empty";

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { user: ["list"] },
    },
  });
  if (!permission.success) {
    redirect("/dashboard");
  }
  const data = await auth.api.listUsers({
    headers: await headers(),
    query: {
      filterField: "id",
      filterOperator: "ne",
      filterValue: session.user.id,
    },
  });
  console.log(data);
  if (!data.total || !data.users) {
    return <UsersEmpty />;
  }
  return (
    <DataTable
      columns={columns}
      data={data.users as User[]}
      placeholder="Filtrar por Nombre, Role, Email y Rut"
    >
      <ActionDialogManager
        createDialog={NewUserDialog}
        triggerLabel="Crear usuario"
      />
    </DataTable>
  );
}
