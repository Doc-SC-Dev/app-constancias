"use server";

import { revalidatePath } from "next/cache";
import { Gender, Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import type {
  AcademicDegreeCreateDto,
  AcademicDegreeEditDto,
} from "@/lib/types/acadmic-grades";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import { withAudit } from "@/lib/with-audit";
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
            id: true,
            gender: true,
            abbrev: true,
          },
        },
      },
    }),
  ]);

  const data = degrees.map<AcademicDegreeDto>((degree) => {
    const maleTitle = degree.title.filter((t) => t.gender === Gender.MALE);
    const femaleTitle = degree.title.filter((t) => t.gender === Gender.FEMALE);
    return {
      ...degree,
      abbrevFem: femaleTitle.at(0)?.abbrev ?? "",
      abbrevMas: maleTitle.at(0)?.abbrev ?? "",
      abbrevFemId: femaleTitle.at(0)?.id ?? "",
      abbrevMasId: maleTitle.at(0)?.id ?? "",
    };
  });
  return { data, nextPage: pageParam + 1, totalRows: count };
};

const createAcademicDegree = async ({
  name,
  abbrevFem,
  abbrevMas,
}: AcademicDegreeCreateDto): Promise<
  ReturnType<Result<AcademicDegreeDto, string>["serialize"]>
> => {
  const degree = await dbWithAutdit().academicDegree.create({
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
    include: {
      title: {
        select: {
          id: true,
          gender: true,
          abbrev: true,
        },
      },
    },
  });
  const serializeData = Result.ok<AcademicDegreeDto, string>({
    ...degree,
    abbrevFem,
    abbrevMas,
    abbrevFemId:
      degree.title.filter((t) => t.gender === Gender.FEMALE).at(0)?.id ?? "",
    abbrevMasId:
      degree.title.filter((t) => t.gender === Gender.MALE).at(0)?.id ?? "",
  }).serialize();
  return serializeData;
};

export async function auditedCreateAcadmicDegree(
  data: AcademicDegreeCreateDto,
) {
  return await withAudit(() => createAcademicDegree(data));
}

async function editAcademicDegree(data: AcademicDegreeEditDto) {
  try {
    const academicDegree = await dbWithAutdit().academicDegree.update({
      where: { id: data.id },
      data: {
        name: data.name,
        title: {
          update: [
            {
              where: {
                id: data.abbrevFemId,
              },
              data: { abbrev: data.abbrevFem },
            },
            {
              where: {
                id: data.abbrevMasId,
              },
              data: { abbrev: data.abbrevMas },
            },
          ],
        },
      },
    });
    revalidatePath("/admin/academic-degree");
    return Result.ok(academicDegree).serialize();
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Result.fail("La condecoración ya existe").serialize();
      }
      if (error.code === "P2025") {
        return Result.fail("La condecoración no existe").serialize();
      }

      return Result.fail("Error al editar la condecoración").serialize();
    }
    return Result.fail("Error al editar la condecoración").serialize();
  }
}

export async function auditedEditAcademicDegree(data: AcademicDegreeEditDto) {
  return await withAudit(() => editAcademicDegree(data));
}

async function deleteAcademicDegree(id: string) {
  try {
    const academicDegree = await dbWithAutdit().academicDegree.delete({
      where: { id },
    });
    revalidatePath("/admin/academic-degree");
    return Result.ok(academicDegree).serialize();
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return Result.fail(
          `El grado académico que se quiere eliminar no existe`,
        ).serialize();
      }
      return Result.fail(
        "Error al eliminar el grado académico, puede que este grado académico tenga usuarios asociados",
      ).serialize();
    }
    return Result.fail("Error al eliminar el grado académico").serialize();
  }
}

export async function auditedDeleteAcademicDegree(id: string) {
  return await withAudit(() => deleteAcademicDegree(id));
}
