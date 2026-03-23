import type { Result } from "@/shared/core/Result";
import type { AcademicDegreeError } from "../../domain/AcademicDegreeError";
import type { AcademicDegreeRepository } from "../../domain/AcademicDegreeRepository";

export async function DeleteAcademicDegree(
  id: string,
  repository: AcademicDegreeRepository,
): Promise<Result<{ name: string }, AcademicDegreeError>> {
  return repository.delete(id);
}
