import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/query-client";
import type { CertificatePaginated } from "@/lib/types/certificate";
import type { PaginationResponse } from "@/lib/types/pagination";
import { getActivityTypes } from "../../action";
import { getPaginatedCertificates } from "../actions";
import CertificateDT from "./_components/tables/certificate-dt";

export default async function ConfigCertificates() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["get-paginated-certificates"],
      queryFn: ({ pageParam }) => getPaginatedCertificates({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (
        _: PaginationResponse<CertificatePaginated>,
        groups: PaginationResponse<CertificatePaginated>[],
      ) => groups.length,
    }),
    queryClient.prefetchQuery({
      queryKey: ["get-list-activity-types"],
      queryFn: getActivityTypes,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CertificateDT />
    </HydrationBoundary>
  );
}
