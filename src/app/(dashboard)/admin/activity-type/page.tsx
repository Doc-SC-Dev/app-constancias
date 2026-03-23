import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ActivityType } from "@/features/activity-type/domain/ActivityType";
import { getPaginatedActivityTypesAction } from "@/features/activity-type/presentation/actions";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import ActivityTypesDT from "./_components/tables/activity-types-dt";

export default async function ConfigActivityType() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-paginated-activity-types"],
    queryFn: ({ pageParam }) => getPaginatedActivityTypesAction({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginationResponse<ActivityType>) =>
      lastPage.nextPage,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityTypesDT />
    </HydrationBoundary>
  );
}
