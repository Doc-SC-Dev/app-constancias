"use server";

import { db } from "@/lib/db";
import type { HistoryEntry } from "@/lib/types/history";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";

export const getHistoryPaginated = async ({
  pageParam,
  user,
  isAdmin,
}: {
  pageParam: number;
  user: User;
  isAdmin: boolean;
}): Promise<PaginationResponse<HistoryEntry>> => {
  const start = pageParam * PAGE_SIZE;
  const [count, data] = await db.$transaction([
    db.request.count({ where: isAdmin ? undefined : { userId: user.id } }),
    db.request.findMany({
      where: isAdmin ? undefined : { userId: user.id },
      take: PAGE_SIZE,
      skip: start,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        certificate: true,
      },
    }),
  ]);

  const historyData: HistoryEntry[] = data.map((request) => ({
    id: request.id,
    name: request.user.name,
    rut: request.user.rut,
    role:
      (request.user.role as
        | "administrator"
        | "professor"
        | "student"
        | "superadmin"
        | "guest") || "guest",
    certName: request.certificate.name,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }));
  return { data: historyData, nextPage: pageParam + 1, totalRows: count };
};
