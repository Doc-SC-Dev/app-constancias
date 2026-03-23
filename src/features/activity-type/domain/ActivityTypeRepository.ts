import type { PaginationResponse } from "@/lib/types/pagination";
import type { Result } from "@/shared/core/Result";
import type {
  ActivityType,
  CreateActivityTypeInput,
  CreateParticipantTypeInput,
  UpdateParticipantTypeInput,
} from "./ActivityType";
import type { ActivityTypeError } from "./ActivityTypeError";

export interface ActivityTypeRepository {
  findById(id: string): Promise<Result<ActivityType, ActivityTypeError>>;
  findAllPaged(
    page: number,
  ): Promise<Result<PaginationResponse<ActivityType>, ActivityTypeError>>;
  create(
    data: CreateActivityTypeInput,
  ): Promise<Result<ActivityType, ActivityTypeError>>;
  update(
    id: string,
    name: string,
  ): Promise<Result<ActivityType, ActivityTypeError>>;
  delete(id: string): Promise<Result<{ name: string }, ActivityTypeError>>;

  // Participant Type relations
  createParticipantType(
    data: CreateParticipantTypeInput,
  ): Promise<
    Result<ActivityType["participantTypes"][number], ActivityTypeError>
  >;
  updateParticipantType(
    data: UpdateParticipantTypeInput,
  ): Promise<
    Result<ActivityType["participantTypes"][number], ActivityTypeError>
  >;
  deleteParticipantType(
    id: string,
  ): Promise<Result<{ id: string }, ActivityTypeError>>;
}
