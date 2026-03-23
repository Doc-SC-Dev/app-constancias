"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin, type Role } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { Result } from "@/shared/core/Result";

export const getNonDirectorUsers = async () => {
  const users = await db.user.findMany({
    where: {
      isDirector: false,
      banned: false,
      role: {
        notIn: ["SUPERADMIN", "STUDENT"],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return users;
};

export const changeDirectorAction = async ({
  userId,
  oldDirector,
}: {
  userId: string;
  oldDirector: string;
}): Promise<ReturnType<Result<{ name: string }, string>["serialize"]>> => {
  try {
    const newDirector = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: oldDirector,
        },
        data: {
          isDirector: false,
        },
      });
      const newDirector = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          isDirector: true,
        },
        select: {
          name: true,
        },
      });
      return newDirector;
    });
    revalidatePath("/admin/general");
    return Result.ok(newDirector).serialize();
  } catch (_) {
    return Result.fail("Error interno cambiando el director.").serialize();
  }
};

export const updateAcademicPeriods = async (
  periods: { startDate: Date; endDate: Date }[],
) => {
  const { user } = await isAuthenticated();
  if (!isAdmin(user.role as Role)) {
    return { success: false, message: "No autorizado" };
  }

  await db.academicPeriod.updateMany({
    where: { active: true },
    data: { active: false },
  });

  for (let i = 0; i < periods.length; i++) {
    const periodData = periods[i];
    const year = periodData.startDate.getFullYear();
    const semester = i === 0 ? 1 : 2;
    const name = `${year}-${semester}`;

    const existing = await db.academicPeriod.findUnique({ where: { name } });
    if (existing) {
      await db.academicPeriod.update({
        where: { id: existing.id },
        data: {
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          active: false,
        },
      });
    } else {
      await db.academicPeriod.create({
        data: {
          name,
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          active: false,
          createdBy: user.id,
        },
      });
    }
  }

  const currentDate = new Date();
  const newActivePeriod = await db.academicPeriod.findFirst({
    where: {
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
  });

  if (newActivePeriod) {
    await db.academicPeriod.update({
      where: { id: newActivePeriod.id },
      data: { active: true },
    });
  }

  revalidatePath("/admin");
  return { success: true, message: "Períodos actualizados exitosamente" };
};
