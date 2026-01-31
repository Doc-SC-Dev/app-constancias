import { QueryClient } from "@tanstack/react-query";
import type { CertificatePaginated } from "@/lib/types/certificate";
import type { PaginationResponse } from "@/lib/types/pagination";
import { getPaginatedCertificates } from "../actions";
import CertificateDT from "./tables/certificate-dt";

export default async function ConfigCertificates() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-paginated-certificates"],
    queryFn: ({ pageParam }) => getPaginatedCertificates({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _: PaginationResponse<CertificatePaginated>,
      groups: PaginationResponse<CertificatePaginated>[],
    ) => groups.length,
  });
  return <CertificateDT />;
}
