import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { LazyCreateUserDialog } from "@/components/dyamic-dialogs";
import { LazyDataTable } from "@/components/dynamic-table";
import { auth, isAuthenticated } from "@/lib/auth";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";
import { columns } from "./_components/colums";
import { listUsers } from "./actions";

export default async function UsersPage() {
  const session = await isAuthenticated();
  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { user: ["list"] },
    },
  });
  if (!permission.success) {
    redirect("/dashboard");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-users"],
    queryFn: ({ pageParam }) => listUsers({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (_lastPage: PaginationResponse<User>) =>
      _lastPage.nextPage,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container max-h-full mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
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
      </div>
    </HydrationBoundary>
  );
}
