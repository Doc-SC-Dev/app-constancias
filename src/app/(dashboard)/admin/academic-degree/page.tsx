import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { AcademicDegree } from "@/features/academic-degree/domain/AcademicDegree";
import { getPaginatedAcademicDegreesAction } from "@/features/academic-degree/presentation/actions";
import { ConfigGrades } from "@/features/academic-degree/presentation/components/ConfigGrades";
import type { PaginationResponse } from "@/lib/types/pagination";

export default async function AcademicDegreePage() {
  const queryClient = new QueryClient();
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
