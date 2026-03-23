import type { Result } from "@/shared/core/Result";
import type { ActivityType } from "../../domain/ActivityType";
import type { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";

export async function GetActivityTypeById(
  id: string,
  repository: ActivityTypeRepository,
): Promise<Result<ActivityType, ActivityTypeError>> {
  return repository.findById(id);
}
