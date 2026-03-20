import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/query-client";
import type { HistoryEntry } from "@/lib/types/history";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";
import { getHistoryPaginated } from "../actions";
import { HistoryDataTable } from "./history-data-table";

export async function StandardTableWrapper({
  user,
  isAdmin,
}: {
  user: User;
  isAdmin: boolean;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-history-standard"],
    queryFn: ({ pageParam }) =>
      getHistoryPaginated({
        pageParam,
        user,
        isAdmin,
        filter: "standard",
      }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<HistoryEntry>,
      groups: PaginationResponse<HistoryEntry>[],
    ) => groups.length,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryDataTable user={user} isAdmin={isAdmin} filter="standard" />
    </HydrationBoundary>
  );
}

export async function OtherTableWrapper({
  user,
  isAdmin,
}: {
  user: User;
  isAdmin: boolean;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-history-other"],
    queryFn: ({ pageParam }) =>
      getHistoryPaginated({
        pageParam,
        user,
        isAdmin,
        filter: "other",
      }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<HistoryEntry>,
      groups: PaginationResponse<HistoryEntry>[],
    ) => groups.length,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryDataTable user={user} isAdmin={isAdmin} filter="other" />
    </HydrationBoundary>
  );
}
