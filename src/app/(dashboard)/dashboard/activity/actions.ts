"use server";

import { revalidatePath } from "next/cache";
import type { ActivityCreateDTO } from "@/core/dtos/activity/create-activity.dto";
import { CreateActivityUseCase } from "@/core/use-cases/activity/create-activity.use-case";
import { GetActivityUseCase } from "@/core/use-cases/activity/get-activity.use-case";
import type { Role } from "@/generated/prisma";
import { PrismaActivityRespository } from "@/infrastructure/repositories/prisma-activity.repository";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import type { ActivityDTO, ActivityEdit } from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";
import type { ActivityParticipantDTO } from "@/lib/types/paricipant-activity";

export async function updateActivity(data: ActivityEdit, id: string) {
  try {
    await dbWithAutdit().$transaction([
      db.participant.deleteMany({
        where: { activityId: id },
      }),
      db.activity.update({
        where: { id },
        data: {
          name: data.name,
          activityType: {
            connect: {
              id: data.activityType,
            },
          },
          nParticipants: data.participants?.length || 0,
          startAt: data.startAt,
          endAt: data.endAt,
          participants: {
            createMany: {
              data:
                data.participants?.map((p) => ({
                  userId: p.id,
                  participantTypeId: p.type,
                  hours: p.hours,
                })) || [],
            },
          },
        },
      }),
    ]);
    revalidatePath(`/dashboard/activity/${id}`);
    return { success: true, message: "Actividad actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar la actividad" };
  }
}

export async function deleteActivity({ activityId }: { activityId: string }) {
  try {
    await db.$transaction(async (ctx) => {
      await ctx.participant.deleteMany({
        where: { activityId },
      });
      await ctx.activity.delete({
        where: { id: activityId },
      });
    });
    revalidatePath("/dashboard/activity");
    return { success: true, message: "Actividad eliminada correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar la actividad" };
  }
}

export const getActivitiesPaginated = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<ActivityDTO>> => {
  const session = await isAuthenticated();
  const start = pageParam * PAGE_SIZE;

  const [count, data] = await db.$transaction([
    db.activity.count({
      where: isAdmin(session.user.role as Role)
        ? {}
        : {
            participants: {
              some: {
                userId: {
                  equals: session.user.id,
                },
              },
            },
          },
    }),
    db.activity.findMany({
      where: isAdmin(session.user.role as Role)
        ? {}
        : {
            participants: {
              some: {
                userId: {
                  equals: session.user.id,
                },
              },
            },
          },
      take: PAGE_SIZE,
      skip: start,
      include: {
        activityType: {
          select: {
            name: true,
          },
        },
        participants: {
          include: {
            type: {
              select: {
                name: true,
                id: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    data: data.map<ActivityDTO>((activity) => ({
      activityType: activity.activityType.name,
      id: activity.id,
      name: activity.name,
      startAt: activity.startAt.toISOString(),
      endAt: activity.endAt ? activity.endAt.toISOString() : undefined,
      nParticipants: activity.nParticipants,
      encargado: activity.participants[0].user.name,
    })),
    nextPage: pageParam + 1,
    totalRows: count,
  };
};

export const createActivity = async ({
  activity,
}: {
  activity: ActivityCreateDTO;
}) => {
  const activityRepo = new PrismaActivityRespository();
  const useCase = new CreateActivityUseCase(activityRepo);
  const result = await useCase.execute(activity);
  if (result.isSuccess) {
    revalidatePath("/dashboard/activity");
    return { isSuccess: result.isSuccess, value: result.getValue };
  }
  return { error: result.getError, isSuccess: result.isSuccess };
};

export const getActivityTypes = async () => {
  const data = await db.activityType.findMany({
    select: {
      id: true,
      name: true,
      participantTypes: {
        select: {
          id: true,
          name: true,
          required: true,
        },
      },
    },
  });

  return data;
};

export const getActivityParticipants = async ({
  activityId,
}: {
  activityId: string;
}): Promise<ActivityParticipantDTO[]> => {
  const data = await db.participant.findMany({
    where: {
      activityId,
    },
    select: {
      id: true,
      hours: true,
      type: {
        select: {
          name: true,
          id: true,
        },
      },
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return data.map<ActivityParticipantDTO>((participant) => ({
    id: participant.id,
    hours: participant.hours,
    typeId: participant.type.id,
    typeName: participant.type.name,
    userId: participant.user.id,
    userName: participant.user.name,
  }));
};

export const getActivityById = async (activityId: string) => {
  const activityRepo = new PrismaActivityRespository();
  const useCase = new GetActivityUseCase(activityRepo);
  const result = await useCase.execute(activityId);
  if (result.isSuccess)
    return { isSuccess: result.isSuccess, value: result.getValue };
  return { isSuccess: result.isSuccess, error: result.getError };
};
