import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { CertificatePaginated } from "@/lib/types/certificate";
import type { PaginationResponse } from "@/lib/types/pagination";
import { getActivityTypes } from "../../action";
import { getPaginatedCertificates } from "../actions";
import CertificateDT from "./tables/certificate-dt";

export default async function ConfigCertificates() {
  const queryClient = new QueryClient();

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
