import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { auth, isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActivityWithUser } from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { ActivityEmpty } from "./_components/activity-empty";
import { columns } from "./_components/activity-columns";
import CreateActivityDialog from "./_components/create-activity-dialog";
import { getActivitiesPaginated } from "./actions";

export default async function ActivityPage() {
  const session = await isAuthenticated();
  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { activity: ["list"] },
    },
  });
  if (!permission.success) {
    redirect("/dashboard");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-activity"],
    queryFn: ({ pageParam }) => getActivitiesPaginated({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginationResponse<ActivityWithUser>) =>
      lastPage.nextPage,
  });
 /*  const data = await db.activity.findMany();
  if (!data.length || !data) {
    return <ActivityEmpty />;
  } */
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataTable
        columns={columns}
        queryFn={getActivitiesPaginated}
        queryKey="list-activity"
        placeholder="Filtrar datos en columnas"
      >
        <ActionDialogManager
          createDialog={CreateActivityDialog}
          triggerLabel="Crear actividad"
        />
      </DataTable>
    </HydrationBoundary>
  );
}
