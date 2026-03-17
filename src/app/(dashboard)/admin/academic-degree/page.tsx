import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { AcademicDegreeDto } from "./_components/config-grades";
import ConfigGrades from "./_components/config-grades";
import { getPaginatedAcademicDegree } from "./actions";

export default async function AcademicDegreePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-all-academic-degree-paginated"],
    queryFn: ({ pageParam }) => getPaginatedAcademicDegree({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _: PaginationResponse<AcademicDegreeDto>,
      groups: PaginationResponse<AcademicDegreeDto>[],
    ) => groups.at(-1)?.nextPage,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfigGrades />
    </HydrationBoundary>
  );
}
