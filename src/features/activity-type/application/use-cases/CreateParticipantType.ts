import { ArkErrors } from "arktype";
import { Result } from "@/shared/core/Result";
import type { ActivityType } from "../../domain/ActivityType";
import { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";
import { CreateParticipantTypeSchema } from "../../infrastructure/activity-type.schema";

export async function CreateParticipantType(
  data: unknown, // Using any for now to facilitate transition, but with validation
  repository: ActivityTypeRepository,
): Promise<
  Result<ActivityType["participantTypes"][number], ActivityTypeError>
> {
  const validation = CreateParticipantTypeSchema(data);
  if (validation instanceof ArkErrors) {
    return Result.fail(ActivityTypeError.validationError(validation.summary));
  }
  return repository.createParticipantType(validation);
}
