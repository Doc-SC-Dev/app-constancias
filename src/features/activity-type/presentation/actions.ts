"use server";

import { revalidatePath } from "next/cache";
import { withAudit } from "@/lib/with-audit";
import { Result, type SerializedResult } from "@/shared/core/Result";
import { CreateActivityType } from "../application/use-cases/CreateActivityType";
import { CreateParticipantType } from "../application/use-cases/CreateParticipantType";
import { DeleteActivityType } from "../application/use-cases/DeleteActivityType";
import { DeleteParticipantType } from "../application/use-cases/DeleteParticipantType";
import { GetActivityTypeById } from "../application/use-cases/GetActivityTypeById";
import { GetPaginatedActivityTypes } from "../application/use-cases/GetPaginatedActivityTypes";
import { UpdateActivityType } from "../application/use-cases/UpdateActivityType";
import { UpdateParticipantType } from "../application/use-cases/UpdateParticipantType";
import type {
  ActivityType,
  CreateActivityTypeInput,
  CreateParticipantTypeInput,
  UpdateParticipantTypeInput,
} from "../domain/ActivityType";
import { ActivityTypeRepositoryImpl } from "../infrastructure/ActivityTypeRepositoryImpl";

const repository = new ActivityTypeRepositoryImpl();

export async function getActivityTypeByIdAction(id: string) {
  const result = await GetActivityTypeById(id, repository);
  // Need to handle Serialization if we want to return directly to client
  // But wait, the existing code uses serialize().
  // I'll make sure the Result class has serialize() and use it.
  return result.serialize();
}

export async function getPaginatedActivityTypesAction({
  pageParam,
}: {
  pageParam: number;
}) {
  const result = await GetPaginatedActivityTypes(pageParam, repository);
  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }
  return result.value;
}

export async function createActivityTypeAction(data: CreateActivityTypeInput) {
  return withAudit(async () => {
    const result = await CreateActivityType(data, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    return result.serialize() as SerializedResult<ActivityType, string>;
  });
}

export async function updateActivityTypeAction(id: string, name: string) {
  return withAudit(async () => {
    const result = await UpdateActivityType(id, name, repository);
    revalidatePath(`/admin/activity-type/${id}`);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    return result.serialize() as SerializedResult<ActivityType, string>;
  });
}

export async function deleteActivityTypeAction(id: string) {
  return withAudit(async () => {
    const result = await DeleteActivityType(id, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }

    revalidatePath("/admin/activity-type");
    return result.serialize() as SerializedResult<{ name: string }, string>;
  });
}

export async function createParticipantTypeAction(
  data: CreateParticipantTypeInput,
) {
  return withAudit(async () => {
    const result = await CreateParticipantType(data, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }

    revalidatePath(`/admin/activity-type/${data.activityTypeId}`);
    return result.serialize() as SerializedResult<
      ActivityType["participantTypes"][number],
      string
    >;
  });
}

export async function updateParticipantTypeAction(
  data: UpdateParticipantTypeInput,
) {
  return withAudit(async () => {
    const result = await UpdateParticipantType(data, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    revalidatePath(`/admin/activity-type/${data.activityTypeId}`);
    return result.serialize() as SerializedResult<
      ActivityType["participantTypes"][number],
      string
    >;
  });
}

export async function deleteParticipantTypeAction(
  id: string,
  activityTypeId: string,
) {
  return withAudit(async () => {
    const result = await DeleteParticipantType(id, repository);
    if (!result.isSuccess) {
      return Result.fail(result.error.message).serialize();
    }
    revalidatePath(`/admin/activity-type/${activityTypeId}`);
    return result.serialize() as SerializedResult<{ id: string }, string>;
  });
}
