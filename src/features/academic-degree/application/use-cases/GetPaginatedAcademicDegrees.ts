import type { PaginationResponse } from "@/lib/types/pagination";
import type { Result } from "@/shared/core/Result";
import type { AcademicDegree } from "../../domain/AcademicDegree";
import type { AcademicDegreeError } from "../../domain/AcademicDegreeError";
import type { AcademicDegreeRepository } from "../../domain/AcademicDegreeRepository";

export async function GetPaginatedAcademicDegrees(
  page: number,
  repository: AcademicDegreeRepository,
): Promise<Result<PaginationResponse<AcademicDegree>, AcademicDegreeError>> {
  return repository.findAllPaged(page);
}
