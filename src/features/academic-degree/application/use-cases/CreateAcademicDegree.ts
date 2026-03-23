import { ArkErrors } from "arktype";
import { Result } from "@/shared/core/Result";
import type {
  AcademicDegree,
  CreateAcademicDegreeInput,
} from "../../domain/AcademicDegree";
import type { AcademicDegreeError } from "../../domain/AcademicDegreeError";
import type { AcademicDegreeRepository } from "../../domain/AcademicDegreeRepository";
import { CreateAcademicDegreeSchema } from "../../infrastructure/academic-degree.schema";

export async function CreateAcademicDegree(
  data: CreateAcademicDegreeInput,
  repository: AcademicDegreeRepository,
): Promise<Result<AcademicDegree, AcademicDegreeError>> {
  const result = CreateAcademicDegreeSchema(data);

  if (result instanceof ArkErrors) {
    return Result.fail({
      type: "UNEXPECTED_ERROR",
      message: result.summary,
    });
  }

  return repository.create(result);
}
