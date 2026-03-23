import type { Result } from "@/shared/core/Result";
import type { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";

export async function DeleteParticipantType(
  id: string,
  repository: ActivityTypeRepository,
): Promise<Result<{ id: string }, ActivityTypeError>> {
  return repository.deleteParticipantType(id);
}
