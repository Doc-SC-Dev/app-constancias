import type { Result } from "@/shared/core/Result";
import type { ActivityTypeError } from "../../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../../domain/ActivityTypeRepository";

export async function DeleteActivityType(
  id: string,
  repository: ActivityTypeRepository,
): Promise<Result<{ name: string }, ActivityTypeError>> {
  return repository.delete(id);
}
