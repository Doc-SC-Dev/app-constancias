import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { AcademicDegree } from "@/features/academic-degree/domain/AcademicDegree";
import { getPaginatedAcademicDegreesAction } from "@/features/academic-degree/presentation/actions";
import { ConfigGrades } from "@/features/academic-degree/presentation/components/ConfigGrades";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";

export default async function AcademicDegreePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-all-academic-degree-paginated"],
    queryFn: ({ pageParam }) =>
      getPaginatedAcademicDegreesAction({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginationResponse<AcademicDegree>) =>
      lastPage.nextPage,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfigGrades />
    </HydrationBoundary>
  );
}
