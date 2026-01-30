import type { ActivityCreateDTO } from "@/core/dtos/activity/create-activity.dto";
import type { ActivityEntity } from "@/core/entities/activity.entity";
import type { ActivityError } from "@/core/errors/activity-error";
import type { IActivityRepository } from "@/core/interfaces/repositories/activity-respository.interface";
import { withAudit } from "@/lib/with-audit";
import type { Result } from "@/shared/core/Result";

export class CreateActivityUseCase {
  constructor(private activityRepo: IActivityRepository) {}
  async execute(
    activity: ActivityCreateDTO,
  ): Promise<Result<ActivityEntity, ActivityError>> {
    return await withAudit(() => this.activityRepo.create(activity));
  }
}
