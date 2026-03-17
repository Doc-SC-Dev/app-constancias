import { ArkErrors } from "arktype";
import { Result } from "@/shared/core/Result";
import type {
  ActivityType,
  CreateActivityTypeInput,
} from "../../domain/ActivityType";
import { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";
import { CreateActivityTypeSchema } from "../../infrastructure/activity-type.schema";

export async function CreateActivityType(
  data: CreateActivityTypeInput,
  repository: ActivityTypeRepository,
): Promise<Result<ActivityType, ActivityTypeError>> {
  const validation = CreateActivityTypeSchema(data);
  if (validation instanceof ArkErrors) {
    return Result.fail(ActivityTypeError.validationError(validation.summary));
  }
  return repository.create(validation);
}
