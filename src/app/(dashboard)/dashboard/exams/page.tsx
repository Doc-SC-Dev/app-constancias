import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin, Roles } from "@/lib/authorization/permissions";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import { ExamsTable } from "./_components/exams-table";
import { type Exams, listExams } from "./actions";

export default async function ExamsPage() {
  const session = await isAuthenticated();

  const isStudent = session.user.role === Roles.STUDENT;
  const sysAdmin = isAdmin(session.user.role as Role);

  if (!sysAdmin && !isStudent) {
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
      <div className="container max-h-full mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Exámenes</h2>
        <ExamsTable isStudent={isStudent} isAdmin={sysAdmin} />
      </div>
    </HydrationBoundary>
  );
}
