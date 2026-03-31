import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { hasPermission } from "@/lib/auth";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";
import { UsersTable } from "./_components/users-table";
import { listUsers } from "./actions";

export default async function UsersPage() {
  await hasPermission({ user: ["list"] });

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
        <UsersTable />
      </div>
    </HydrationBoundary>
  );
}
