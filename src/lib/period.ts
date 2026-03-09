import { db } from "@/lib/db";
import type { AcademicPeriod } from "@/generated/prisma";

export async function getOrUpdateActivePeriod(): Promise<AcademicPeriod | null> {
  const currentDate = new Date();

  const activePeriod = await db.academicPeriod.findFirst({
    where: { active: true },
  });

  if (activePeriod) {
    if (activePeriod.endDate >= currentDate && activePeriod.startDate <= currentDate) {
      return activePeriod;
    }
  }

  await db.academicPeriod.updateMany({
    where: { active: true },
    data: { active: false },
  });
  const newActivePeriod = await db.academicPeriod.findFirst({
    where: {
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
  });

  if (newActivePeriod) { 
    return await db.academicPeriod.update({
      where: { id: newActivePeriod.id },
      data: { active: true },
    });
  }

  return null;
}
