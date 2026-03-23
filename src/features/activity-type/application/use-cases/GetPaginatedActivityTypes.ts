import type { PaginationResponse } from "@/lib/types/pagination";
import type { Result } from "@/shared/core/Result";
import type { ActivityType } from "../../domain/ActivityType";
import type { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";

export async function GetPaginatedActivityTypes(
  page: number,
  repository: ActivityTypeRepository,
): Promise<Result<PaginationResponse<ActivityType>, ActivityTypeError>> {
  return repository.findAllPaged(page);
}
