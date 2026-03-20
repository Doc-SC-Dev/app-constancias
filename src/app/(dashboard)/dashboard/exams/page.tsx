import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth, isAuthenticated } from "@/lib/auth";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import { ExamsTable } from "./_components/exams-table";
import { type Exams, listExams } from "./actions";

export default async function ExamsPage() {
  const session = await isAuthenticated();

  const isStudent = session.user.role === "STUDENT";

  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { activity: ["list"] },
    },
  });
  if (!permission.success && !isStudent) {
    redirect("/dashboard");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-exams"],
    queryFn: ({ pageParam }) => listExams({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<Exams>,
      groups: PaginationResponse<Exams>[],
    ) => groups.length,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container h-full mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Exámenes</h2>
        <ExamsTable isStudent={isStudent} />
      </div>
    </HydrationBoundary>
  );
}
