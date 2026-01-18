"use server";

import { db } from "@/lib/db";
import type { HistoryEntry } from "@/lib/types/history";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import type { User } from "@/lib/types/users";

export const getHistoryPaginated = async ({
  pageParam,
  user,
  isAdmin,
  filter,
}: {
  pageParam: number;
  user: User;
  isAdmin: boolean;
  filter?: "standard" | "other";
}): Promise<PaginationResponse<HistoryEntry>> => {
  const start = pageParam * PAGE_SIZE;

  const where: any = isAdmin ? {} : { userId: user.id };

  if (filter === "standard") {
    where.otherRequest = { is: null };
  } else if (filter === "other") {
    where.otherRequest = { isNot: null };
  }

  const [count, data] = await db.$transaction([
    db.request.count({ where }),
    db.request.findMany({
      where,
      take: PAGE_SIZE,
      skip: start,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        certificate: true,
        otherRequest: true,
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
    state: request.state,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    link: request.otherRequest?.link || undefined,
    rejectionReason: request.otherRequest?.rejectionReason || undefined,
  }));
  return { data: historyData, nextPage: pageParam + 1, totalRows: count };
};

export const updateRequestState = async (
  requestId: string,
  newState: "PENDING" | "APPROVED" | "REJECTED",
  link?: string,
  rejectionReason?: string,
) => {
  try {
    const updateData: any = { state: newState };

    if (link !== undefined || rejectionReason !== undefined) {
      const request = await db.request.findUnique({
        where: { id: requestId },
        include: { otherRequest: true }
      });

      if (request?.otherRequest) {
        await db.otherRequest.update({
          where: { id: request.otherRequest.id },
          data: {
            link: link,
            rejectionReason: rejectionReason
          }
        });
      }
    }

    await db.request.update({
      where: { id: requestId },
      data: updateData,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar el estado" };
  }
};
