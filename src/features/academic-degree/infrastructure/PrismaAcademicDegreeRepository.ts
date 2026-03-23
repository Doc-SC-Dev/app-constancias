import { Gender, Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import { Result } from "@/shared/core/Result";
import type {
  AcademicDegree,
  CreateAcademicDegreeInput,
  UpdateAcademicDegreeInput,
} from "../domain/AcademicDegree";
import type { AcademicDegreeError } from "../domain/AcademicDegreeError";
import type { AcademicDegreeRepository } from "../domain/AcademicDegreeRepository";

export class PrismaAcademicDegreeRepository
  implements AcademicDegreeRepository
{
  async findAllPaged(
    page: number,
  ): Promise<Result<PaginationResponse<AcademicDegree>, AcademicDegreeError>> {
    try {
      const [count, degrees] = await db.$transaction([
        db.academicDegree.count(),
        db.academicDegree.findMany({
          take: PAGE_SIZE,
          skip: PAGE_SIZE * page,
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

      const data = degrees.map<AcademicDegree>((degree) => {
        const maleTitle = degree.title.filter((t) => t.gender === Gender.MALE);
        const femaleTitle = degree.title.filter(
          (t) => t.gender === Gender.FEMALE,
        );
        return {
          ...degree,
          abbrevFem: femaleTitle.at(0)?.abbrev ?? "",
          abbrevMas: maleTitle.at(0)?.abbrev ?? "",
          abbrevFemId: femaleTitle.at(0)?.id ?? "",
          abbrevMasId: maleTitle.at(0)?.id ?? "",
        };
      });

      return Result.ok({ data, nextPage: page + 1, totalRows: count });
    } catch (_error) {
      return Result.fail({
        type: "DATABASE_ERROR",
        message: "Error al obtener los grados académicos",
      });
    }
  }

  async create(
    data: CreateAcademicDegreeInput,
  ): Promise<Result<AcademicDegree, AcademicDegreeError>> {
    try {
      const degree = await dbWithAutdit().academicDegree.create({
        data: {
          name: data.name,
          title: {
            create: [
              {
                gender: Gender.FEMALE,
                abbrev: data.abbrevFem,
              },
              {
                gender: Gender.MALE,
                abbrev: data.abbrevMas,
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

      const result: AcademicDegree = {
        ...degree,
        abbrevFem: data.abbrevFem,
        abbrevMas: data.abbrevMas,
        abbrevFemId:
          degree.title.find((t) => t.gender === Gender.FEMALE)?.id ?? "",
        abbrevMasId:
          degree.title.find((t) => t.gender === Gender.MALE)?.id ?? "",
      };

      return Result.ok(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return Result.fail({
            type: "DUPLICATED",
            message: "El grado académico ya existe",
          });
        }
      }
      return Result.fail({
        type: "DATABASE_ERROR",
        message: "Error al crear el grado académico",
      });
    }
  }

  async update(
    data: UpdateAcademicDegreeInput,
  ): Promise<Result<AcademicDegree, AcademicDegreeError>> {
    try {
      const academicDegree = await dbWithAutdit().academicDegree.update({
        where: { id: data.id },
        data: {
          name: data.name,
          title: {
            update: [
              {
                where: { id: data.abbrevFemId },
                data: { abbrev: data.abbrevFem },
              },
              {
                where: { id: data.abbrevMasId },
                data: { abbrev: data.abbrevMas },
              },
            ],
          },
        },
      });

      // Wait, the original code had this logic for update:
      /*
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
      */
      // I should follow that.

      return Result.ok({
        ...academicDegree,
        abbrevFem: data.abbrevFem,
        abbrevMas: data.abbrevMas,
        abbrevFemId: data.abbrevFemId,
        abbrevMasId: data.abbrevMasId,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return Result.fail({
            type: "NOT_FOUND",
            message: "El grado académico no existe",
          });
        }
        if (error.code === "P2002") {
          return Result.fail({
            type: "DUPLICATED",
            message: "Ya existe un grado académico con ese nombre",
          });
        }
      }
      return Result.fail({
        type: "DATABASE_ERROR",
        message: "Error al editar el grado académico",
      });
    }
  }

  async delete(
    id: string,
  ): Promise<Result<{ name: string }, AcademicDegreeError>> {
    try {
      const academicDegree = await dbWithAutdit().academicDegree.delete({
        where: { id },
      });
      return Result.ok({ name: academicDegree.name });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return Result.fail({
            type: "NOT_FOUND",
            message: "El grado académico no existe",
          });
        }
      }
      return Result.fail({
        type: "DATABASE_ERROR",
        message: "Error al eliminar el grado académico",
      });
    }
  }
}
