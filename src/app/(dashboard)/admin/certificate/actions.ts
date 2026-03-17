"use server";

import { db } from "@/lib/db";
import type { CertificatePaginated } from "@/lib/types/certificate";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";

export async function getPaginatedCertificates({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<CertificatePaginated>> {
  const [count, certificates] = await db.$transaction([
    db.certificate.count(),
    db.certificate.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            template: true,
          },
        },
        createdAt: true,
      },
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
    }),
  ]);

  return {
    data: certificates.map<CertificatePaginated>((cert) => ({
      ...cert,
      templates: cert._count.template,
    })),
    totalRows: count,
    nextPage: pageParam + 1,
  };
}
