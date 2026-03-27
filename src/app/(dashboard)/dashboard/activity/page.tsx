import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { LazyCreateActivityDialog } from "@/components/dyamic-dialogs";
import { auth, isAuthenticated } from "@/lib/auth";
import getQueryClient from "@/lib/query-client";
import type { ActivityDTO } from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { columns } from "./_components/activity-columns";
import { getActivitiesPaginated } from "./actions";

export default async function ActivityPage() {
  const session = await isAuthenticated();
  const listPermission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { activity: ["list"] },
    },
  });
  if (!listPermission.success) {
    redirect("/dashboard");
  }
  const createPermission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { activity: ["create"] },
    },
  });

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-activity"],
    queryFn: ({ pageParam }) => getActivitiesPaginated({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _: PaginationResponse<ActivityDTO>,
      groups: PaginationResponse<ActivityDTO>[],
    ) => groups.length,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container max-h-full mx-auto flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Actividades</h3>
        <DataTable
          emptyTitle="No hay actividades"
          createDialog={createPermission ? LazyCreateActivityDialog : undefined}
          emptyDescription="No se ha creado ninguna Actividad, para iniciar debe crear una actividad"
          columns={columns}
          queryFn={getActivitiesPaginated}
          queryKey="list-activity"
          placeholder="Filtrar datos en columnas"
          containerClassName="h-fit max-h-full"
        />
      </div>
    </HydrationBoundary>
  );
}
