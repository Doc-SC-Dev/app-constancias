import type { AcademicPeriod } from "@/generated/prisma";
import { db } from "@/lib/db";

export async function getOrUpdateActivePeriod(): Promise<AcademicPeriod | null> {
  const currentDate = new Date();

  const periods = await db.academicPeriod.findMany({
    where: {
      OR: [
        {
          active: true,
        },
        {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
      ],
    },
  });

  if (periods.length === 0) return null;

  const activePeriod = periods.find((period) => period.active);
  const periodInRange = periods.find(
    (period) =>
      period.startDate <= currentDate && period.endDate >= currentDate,
  );

  if (activePeriod) {
    if (activePeriod.id === periodInRange?.id) {
      return activePeriod;
    }

    await db.academicPeriod.update({
      where: { id: activePeriod.id },
      data: { active: false },
    });
  }

  if (periodInRange) {
    return await db.academicPeriod.update({
      where: { id: periodInRange.id },
      data: { active: true },
    });
  }

  return null;
}
