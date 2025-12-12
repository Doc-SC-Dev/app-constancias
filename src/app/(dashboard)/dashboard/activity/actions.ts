"use server";

import { revalidatePath } from "next/cache";
import { withTryCatch } from "@/app/action";
import { db } from "@/lib/db";
import type {
  Activity,
  ActivityCreateInput,
  ActivityWithUser,
} from "@/lib/types/activity";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";

export async function updateActivity(data: Partial<Activity>, id: string) {
  try {
    await db.activity.update({
      where: { id },
      data: {
        name: data.name,
        activityType: data.activityType,
        nParticipants: data.nParticipants,
        startAt: data.startAt,
        endAt: data.endAt,
      },
    });
    revalidatePath("/dashboard/activity");
    return { success: true, message: "Actividad actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar la actividad" };
  }
}

export async function deleteActivity({ activityId }: { activityId: string }) {
  try {
    await db.activity.delete({
      where: { id: activityId },
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
}): Promise<PaginationResponse<ActivityWithUser>> => {
  const start = pageParam * PAGE_SIZE;
  const [count, data] = await db.$transaction([
    db.activity.count(),
    db.activity.findMany({
      take: PAGE_SIZE,
      skip: start,
      include: {
        participants: {
          include: {
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
    data: data.map<ActivityWithUser>((activity) => ({
      ...activity,
      professor: activity.participants[0].user.name,
    })),
    nextPage: pageParam + 1,
    totalRows: count,
  };
};

export const createActivity = async ({
  activity,
}: {
  activity: ActivityCreateInput;
}) => {
  const { participants, type, ...rest } = activity;
  const { error, success } = await withTryCatch<Activity>(
    db.activity.create({
      data: {
        ...rest,
        nParticipants: participants.length,
        activityType: type,
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
    }),
  );
  if (success) revalidatePath("/dashboard/activity");
  return { message: error, success };
};
