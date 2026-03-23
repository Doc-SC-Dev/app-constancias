"use server";
import { Prisma } from "@/generated/prisma";
import { db, dbWithAutdit } from "@/lib/db/prisma";
import type { ActivityType } from "@/lib/types/activity";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import { withAudit } from "@/lib/with-audit";
import { Result } from "@/shared/core/Result";
import type { CreateActivityType } from "./_components/form/create-activity-type-form";

async function createActivityType(
  data: CreateActivityType,
): Promise<ReturnType<Result<ActivityType, string>["serialize"]>> {
  const participanTypes = data.participantTypes.map((pt) =>
    Prisma.validator<Prisma.ParticipantTypeCreateInput>()({
      name: pt.name,
    }),
  );
  const activityTypeInput = Prisma.validator<Prisma.ActivityTypeCreateInput>()({
    name: data.name,
    participantTypes: {
      createMany: {
        data: participanTypes,
      },
    },
  });

  const result = await dbWithAutdit().activityType.create({
    data: activityTypeInput,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return Result.ok<ActivityType, string>({
    ...result,
    nParticipantsTypes: participanTypes.length,
  }).serialize();
}

export async function auditedCreateActivityType(data: CreateActivityType) {
  return await withAudit(() => createActivityType(data));
}

export const getActivityTypesPaginated = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<ActivityType>> => {
  const [count, activityTypes] = await db.$transaction([
    db.activityType.count(),
    db.activityType.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            participantTypes: true,
          },
        },
      },
    }),
  ]);
  return {
    data: activityTypes.map<ActivityType>((activityType) => ({
      ...activityType,
      nParticipantsTypes: activityType._count.participantTypes,
    })),
    nextPage: pageParam + 1,
    totalRows: count,
  };
};
