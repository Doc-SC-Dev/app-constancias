import type { PaginationResponse } from "@/lib/types/pagination";
import type { Result } from "@/shared/core/Result";
import type {
  AcademicDegree,
  CreateAcademicDegreeInput,
  UpdateAcademicDegreeInput,
} from "./AcademicDegree";
import type { AcademicDegreeError } from "./AcademicDegreeError";

export interface AcademicDegreeRepository {
  findAllPaged(
    page: number,
  ): Promise<Result<PaginationResponse<AcademicDegree>, AcademicDegreeError>>;
  create(
    data: CreateAcademicDegreeInput,
  ): Promise<Result<AcademicDegree, AcademicDegreeError>>;
  update(
    data: UpdateAcademicDegreeInput,
  ): Promise<Result<AcademicDegree, AcademicDegreeError>>;
  delete(id: string): Promise<Result<{ name: string }, AcademicDegreeError>>;
}
