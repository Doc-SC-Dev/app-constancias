import type { Role, Roles } from "@/lib/authorization/permissions";

export interface ParticipantType {
  id: string;
  name: string;
  roles: (Roles.STUDENT | Roles.PROFESSOR)[];
  createdAt: Date;
  min: number;
  max: number | null;
}

export interface ActivityType {
  id: string;
  name: string;
  createdAt: Date;
  participantTypes: ParticipantType[];
  _count?: {
    participantTypes: number;
    activities: number;
    template: number;
  };
}

export type CreateActivityTypeInput = {
  name: string;
};

export type UpdateParticipantTypeInput = {
  id: string;
  name: string;
  roles: Role[];
  activityTypeId: string;
  min: number;
  max: number | null;
};

export type CreateParticipantTypeInput = Omit<UpdateParticipantTypeInput, "id">;

export type UpdateActivityTypeNameInput = {
  id: string;
  name: string;
};
