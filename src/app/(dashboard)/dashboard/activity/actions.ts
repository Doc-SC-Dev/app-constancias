"use server";

import { revalidatePath } from "next/cache";
import { withTryCatch } from "@/app/action";
import type { Role } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import type {
  ActivityCreateDTO,
  ActivityDTO,
  ActivityEdit,
} from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";
import type { ActivityParticipantDTO } from "@/lib/types/paricipant-activity";
import { withAudit } from "@/lib/with-audit";
import { Result } from "@/shared/core/Result";

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

export async function addParticipantToActivity(
  activityId: string,
  data: { userId: string; participantTypeId: string; hours: number },
) {
  try {
    await dbWithAutdit().participant.create({
      data: {
        activity: {
          connect: {
            id: activityId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
        type: {
          connect: {
            id: data.participantTypeId,
          },
        },
        hours: data.hours,
      },
    });
    revalidatePath(`/dashboard/activity/${activityId}`);
    return Result.ok("Participante agregado correctamente").serialize();
  } catch (error) {
    console.error(error);
    return Result.fail("Error al agregar el participante").serialize();
  }
}

export async function addParticipantToActivityAudit(
  activityId: string,
  data: {
    userId: string;
    participantTypeId: string;
    hours: number;
  },
) {
  return await withAudit(
    async () => await addParticipantToActivity(activityId, data),
  );
}

export async function removeParticipantFromActivity(
  participantId: string,
  activityId: string,
) {
  try {
    await dbWithAutdit().participant.delete({
      where: { id: participantId },
    });
    revalidatePath(`/dashboard/activity/${activityId}`);
    return { success: true, message: "Participante eliminado correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar el participante" };
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
  const { participants, type, date, ...rest } = activity;
  const { error, success } = await withTryCatch(
    dbWithAutdit().activity.create({
      data: {
        ...rest,
        startAt: date.from,
        endAt: date.to,
        nParticipants: participants.length,
        activityType: {
          connect: {
            id: type,
          },
        },
        participants: {
          createMany: {
            data: participants.map((participant) => ({
              userId: participant.id,
              participantTypeId: participant.type,
              hours: participant.hours,
            })),
          },
        },
      },
    }),
  );
  if (success) revalidatePath("/dashboard/activity");
  return { message: error, success };
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
          maxCapacity: true,
          minCapacity: true,
          roles: true,
        },
      },
    },
  });

  return data.map((activityType) => ({
    ...activityType,
    participantTypes: activityType.participantTypes.map((participantType) => ({
      ...participantType,
      max: participantType.maxCapacity,
      min: participantType.minCapacity,
    })),
  }));
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
  const data = await db.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      id: true,
      name: true,
      startAt: true,
      endAt: true,
      activityType: {
        select: {
          id: true,
          name: true,
        },
      },
      participants: {
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
      },
    },
  });
  if (!data) throw new Error("No existe la actividad con id ");
  const { participants, activityType, ...rest } = data;
  return {
    ...rest,
    participants: participants.map((p) => ({
      id: p.id,
      name: p.user.name,
      userId: p.user.id,
      typeId: p.type.id,
      type: p.type.name,
      hours: p.hours,
    })),
    type: activityType.name,
    typeId: activityType.id,
  };
};
