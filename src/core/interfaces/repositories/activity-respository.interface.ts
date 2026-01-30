import type { ActivityCreateDTO } from "@/core/dtos/activity/create-activity.dto";
import type { ActivityEntity } from "@/core/entities/activity.entity";
import type { ActivityError } from "@/core/errors/activity-error";
import type { Result } from "@/shared/core/Result";

export interface IActivityRepository {
  create(
    activity: ActivityCreateDTO,
  ): Promise<Result<ActivityEntity, ActivityError>>;
  findById(id: string): Promise<Result<ActivityEntity, ActivityError>>;
}
