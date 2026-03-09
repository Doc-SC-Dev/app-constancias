import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { ActivityType } from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { getActivityTypesPaginated } from "../actions";
import ActivityTypesDT from "./tables/activity-types-dt";

export default async function ConfigActivityType() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-paginated-activity-types"],
    queryFn: ({ pageParam }) => getActivityTypesPaginated({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _: PaginationResponse<ActivityType>,
      groups: PaginationResponse<ActivityType>[],
    ) => groups.length,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityTypesDT />
    </HydrationBoundary>
  );
}
