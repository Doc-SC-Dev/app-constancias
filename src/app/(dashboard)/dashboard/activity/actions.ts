"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { type Activity, activitySchema } from "@/lib/types/activity";

export async function updateActivity(data: Partial<Activity>, id: string) {
  try {
    // Validate data if needed, though partial updates might be tricky with strict schema
    // For now, we trust the input or validate specific fields

    await db.activity.update({
      where: { id },
      data: {
        name: data.name,
        activityType: data.activityType,
        nParticipants: data.nParticipants,
        // Handle dates if they are strings or Date objects
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
