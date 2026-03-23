"use server";

import { revalidatePath } from "next/cache";
import { withAudit } from "@/lib/with-audit";
import { Result, type SerializedResult } from "@/shared/core/Result";
import { CreateAcademicDegree } from "../application/use-cases/CreateAcademicDegree";
import { DeleteAcademicDegree } from "../application/use-cases/DeleteAcademicDegree";
import { GetPaginatedAcademicDegrees } from "../application/use-cases/GetPaginatedAcademicDegrees";
import { UpdateAcademicDegree } from "../application/use-cases/UpdateAcademicDegree";
import type {
  AcademicDegree,
  CreateAcademicDegreeInput,
  UpdateAcademicDegreeInput,
} from "../domain/AcademicDegree";
import { PrismaAcademicDegreeRepository } from "../infrastructure/PrismaAcademicDegreeRepository";

const repository = new PrismaAcademicDegreeRepository();

export async function getPaginatedAcademicDegreesAction({
  pageParam,
}: {
  pageParam: number;
}) {
  const result = await GetPaginatedAcademicDegrees(pageParam, repository);
  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }
  return result.value;
}

export async function createAcademicDegreeAction(
  data: CreateAcademicDegreeInput,
) {
  return await withAudit(async () => {
    const result = await CreateAcademicDegree(data, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    revalidatePath("/admin/academic-degree");
    return result.serialize() as SerializedResult<AcademicDegree, string>;
  });
}

export async function updateAcademicDegreeAction(
  data: UpdateAcademicDegreeInput,
) {
  return await withAudit(async () => {
    const result = await UpdateAcademicDegree(data, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    revalidatePath("/admin/academic-degree");
    return result.serialize() as SerializedResult<AcademicDegree, string>;
  });
}

export async function deleteAcademicDegreeAction(id: string) {
  return await withAudit(async () => {
    const result = await DeleteAcademicDegree(id, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    revalidatePath("/admin/academic-degree");
    return result.serialize() as SerializedResult<{ name: string }, string>;
  });
}
