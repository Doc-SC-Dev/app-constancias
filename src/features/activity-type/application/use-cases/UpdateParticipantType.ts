import { Result } from "@/shared/core/Result";
import type {
  ActivityType,
  UpdateParticipantTypeInput,
} from "../../domain/ActivityType";
import { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";
import { UpdateParticipantTypeSchema } from "../../infrastructure/activity-type.schema";

export async function UpdateParticipantType(
  data: UpdateParticipantTypeInput,
  repository: ActivityTypeRepository,
): Promise<
  Result<ActivityType["participantTypes"][number], ActivityTypeError>
> {
  const validation = UpdateParticipantTypeSchema(data);
  if (validation instanceof Error) {
    return Result.fail(ActivityTypeError.validationError(validation.message));
  }
  return repository.updateParticipantType(data);
}
