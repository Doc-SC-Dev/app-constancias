"use server";

import { revalidatePath } from "next/cache";
import { Gender } from "@/generated/prisma";
import { db } from "@/lib/db";
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
