import { ArkErrors } from "arktype";
import { Result } from "@/shared/core/Result";
import type {
  AcademicDegree,
  UpdateAcademicDegreeInput,
} from "../../domain/AcademicDegree";
import type { AcademicDegreeError } from "../../domain/AcademicDegreeError";
import type { AcademicDegreeRepository } from "../../domain/AcademicDegreeRepository";
import { UpdateAcademicDegreeSchema } from "../../infrastructure/academic-degree.schema";

export async function UpdateAcademicDegree(
  data: UpdateAcademicDegreeInput,
  repository: AcademicDegreeRepository,
): Promise<Result<AcademicDegree, AcademicDegreeError>> {
  const result = UpdateAcademicDegreeSchema(data);

  if (result instanceof ArkErrors) {
    return Result.fail({
      type: "UNEXPECTED_ERROR",
      message: result.summary,
    });
  }

  return repository.update(result);
}
