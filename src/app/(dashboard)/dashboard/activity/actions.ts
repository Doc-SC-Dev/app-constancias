"use server";

import { revalidatePath } from "next/cache";
import { withTryCatch } from "@/app/action";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import type {
  ActivityCreateDTO,
  ActivityDTO,
  ActivityEdit,
} from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";
import type { ActivityParticipantDTO } from "@/lib/types/paricipant-activity";

export async function updateActivity(data: ActivityEdit, id: string) {
  try {
    await db.$transaction([
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
  const isAdmin = ["administrator", "superadmin"].includes(
    session.user.role || "",
  );
  const start = pageParam * PAGE_SIZE;
  const [count, data] = await db.$transaction([
    db.activity.count({
      where: isAdmin
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
      where: isAdmin
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
    db.activity.create({
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
