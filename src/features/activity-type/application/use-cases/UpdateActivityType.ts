import { Result } from "@/shared/core/Result";
import type { ActivityType } from "../../domain/ActivityType";
import { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";

export async function UpdateActivityType(
  id: string,
  name: string,
  repository: ActivityTypeRepository,
): Promise<Result<ActivityType, ActivityTypeError>> {
  if (name.length < 2) {
    return Result.fail(
      ActivityTypeError.validationError(
        "El nombre debe tener al menos 2 caracteres",
      ),
    );
  }
  return repository.update(id, name);
}
