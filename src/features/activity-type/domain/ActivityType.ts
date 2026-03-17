import type { Role } from "@/lib/authorization/permissions";

export interface ParticipantType {
  id: string;
  name: string;
  required: boolean;
  roles: Role[];
  createdAt: Date;
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
  participantTypes: {
    name: string;
    required: boolean;
  }[];
};

export type CreateParticipantTypeInput = {
  name: string;
  required: boolean;
  roles: Role[];
  activityTypeId: string;
};

export type UpdateParticipantTypeInput = {
  id: string;
  name: string;
  required: boolean;
  roles: Role[];
  activityTypeId: string;
};

export type UpdateActivityTypeNameInput = {
  id: string;
  name: string;
};
