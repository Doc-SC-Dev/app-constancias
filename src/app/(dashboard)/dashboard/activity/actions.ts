"use server";

import { db } from "@/lib/db";
import type { Activity, ActivityCreateInput } from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";

export const getActivitiesPaginated = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<Activity>> => {
  const start = pageParam * PAGE_SIZE;
  const [count, data] = await db.$transaction([
    db.activity.count(),
    db.activity.findMany({
      take: PAGE_SIZE,
      skip: start,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);
  return { data, nextPage: pageParam + 1, totalRows: count };
};

export const createActivity = async ({
  activity,
}: {
  activity: ActivityCreateInput;
}) => {
  const { participants, ...rest } = activity;
  return await db.activity.create({
    data: {
      ...rest,
      nParticipants: participants.length,
      activityType: rest.type,
      participants: {
        createMany: {
          data: participants.map((participant) => ({
            userId: participant.id,
            type: participant.type,
            hours: participant.hours,
          })),
        },
      },
    },
  });
};
