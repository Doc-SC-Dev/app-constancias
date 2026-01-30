import type { ActivityEntity } from "@/core/entities/activity.entity";
import type { ActivityError } from "@/core/errors/activity-error";
import type { IActivityRepository } from "@/core/interfaces/repositories/activity-respository.interface";
import type { Result } from "@/shared/core/Result";

export class GetActivityUseCase {
  constructor(private activityRepo: IActivityRepository) {}

  async execute(id: string): Promise<Result<ActivityEntity, ActivityError>> {
    return await this.activityRepo.findById(id);
  }
}
