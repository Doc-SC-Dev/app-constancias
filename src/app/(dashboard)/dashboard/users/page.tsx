import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserWithActivities } from "@/lib/types/users";
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
  const users = await db.user.findMany({
    where: {
      id: {
        not: session.user.id,
      },
    },
    include: {
      participants: {
        include: {
          activity: true,
        },
      },
    },
  });

  if (users.length === 0) {
    return <UsersEmpty />;
  }
  return (
    <DataTable
      columns={columns}
      data={users as unknown as UserWithActivities[]}
      placeholder="Filtrar por Nombre, Role, Email y Rut"
    >
      <ActionDialogManager
        createDialog={NewUserDialog}
        triggerLabel="Crear usuario"
      />
    </DataTable>
  );
}
