import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { HistoryEntry } from "@/lib/types/history";
import type { PaginationResponse } from "@/lib/types/pagination";
import { HistoryClient } from "./_components/history-client";
import { getHistoryPaginated } from "./actions";

export default async function HistoryPage() {
  const nextHeader = await headers();
  const session = await auth.api.getSession({
    headers: nextHeader,
  });

  if (!session) {
    redirect("/login");
  }

  const { success } = await auth.api.userHasPermission({
    headers: nextHeader,
    body: {
      permissions: {
        request: ["list"],
      },
    },
  });

  if (!success) {
    return redirect("/dashboard");
  }

  const userRole = session.user.role || "guest";
  const isAdmin = userRole === "administrator" || userRole === "superadmin";

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-history"],
    queryFn: ({ pageParam }) =>
      getHistoryPaginated({
        pageParam,
        user: session.user,
        isAdmin,
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
        <HistoryClient isAdmin={isAdmin} user={session.user} />
      </div>
    </HydrationBoundary>
  );
}
