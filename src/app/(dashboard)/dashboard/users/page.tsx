import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { auth } from "@/lib/auth";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";
import { columns } from "./_components/colums";
import NewUserDialog from "./_components/newuser-dialog";
import { listUsers } from "./actions";

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

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-users"],
    queryFn: ({ pageParam }) => listUsers({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<User>,
      groups: PaginationResponse<User>[],
    ) => groups.length,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataTable<User>
        emptyTitle="No hay usuarios"
        emptyDescription="No hay usuarios disponibles. Para iniciar debe crear un usuario"
        buttonLabel="Crear usuario"
        createDialog={NewUserDialog}
        columns={columns}
        queryKey="list-users"
        queryFn={listUsers}
        placeholder="Filtrar por Nombre, Role, Email y Rut"
      >
        <ActionDialogManager
          createDialog={NewUserDialog}
          triggerLabel="Crear usuario"
        />
      </DataTable>
    </HydrationBoundary>
  );
}
