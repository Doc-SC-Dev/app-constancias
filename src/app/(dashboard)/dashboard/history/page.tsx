import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import type { HistoryEntry } from "@/lib/types/history";
import type { PaginationResponse } from "@/lib/types/pagination";
import { HistoryClient } from "./_components/history-client";
import { getHistoryPaginated } from "./actions";

export default async function HistoryPage() {
  const { user } = await isAuthenticated();

  const { success } = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permissions: {
        request: ["list"],
      },
    },
  });

  if (!success) {
    return redirect("/dashboard");
  }

  const userRole = user.role as Role;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-history-standard"],
    queryFn: ({ pageParam }) =>
      getHistoryPaginated({
        pageParam,
        user: user,
        isAdmin: isAdmin(userRole),
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
      <div className="container h-full mx-auto">
        <HistoryClient isAdmin={isAdmin(userRole)} user={user} />
      </div>
    </HydrationBoundary>
  );
}
