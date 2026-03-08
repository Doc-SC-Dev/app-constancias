"use server";

import { revalidatePath } from "next/cache";
import { Gender, Role } from "@/generated/prisma";
import { db } from "@/lib/db";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import type { AcademicDegreeCreateDto } from "@/lib/types/acadmic-grades";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import { Result } from "@/shared/core/Result";
import type { AcademicDegreeDto } from "./_components/config-grades";

export const getPaginatedAcademicDegree = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<AcademicDegreeDto>> => {
  const [count, degrees] = await db.$transaction([
    db.academicDegree.count(),
    db.academicDegree.findMany({
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
      include: {
        title: {
          select: {
            gender: true,
            abbrev: true,
          },
        },
      },
    }),
  ]);

  const data = degrees.map<AcademicDegreeDto>((degree) => ({
    ...degree,
    abbrevFem:
      degree.title.filter((t) => t.gender === Gender.FEMALE)?.at(0)?.abbrev ??
      "",
    abbrevMas:
      degree.title.filter((t) => t.gender === Gender.MALE)?.at(0)?.abbrev ?? "",
  }));
  return { data, nextPage: pageParam + 1, totalRows: count };
};

export const createAcademicDegree = async ({
  name,
  abbrevFem,
  abbrevMas,
}: AcademicDegreeCreateDto): Promise<
  ReturnType<Result<AcademicDegreeDto, Error>["serialize"]>
> => {
  const degree = await db.academicDegree.create({
    data: {
      name,
      title: {
        create: [
          {
            gender: Gender.FEMALE,
            abbrev: abbrevFem,
          },
          {
            gender: Gender.MALE,
            abbrev: abbrevMas,
          },
        ],
      },
    },
  });
  revalidatePath("/admin?tab=grades");
  const serializeData = Result.ok<AcademicDegreeDto, Error>({
    ...degree,
    abbrevFem,
    abbrevMas,
  }).serialize();
  return serializeData;
};

export const updateAcademicPeriods = async (periods: { startDate: Date, endDate: Date }[]) => {
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
        }
      });
    } else {
      await db.academicPeriod.create({
        data: {
          name,
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          active: false,
          createdBy: user.id
        }
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
  return { success: true, message: "Periodos actualizados exitosamente" };
};
