export type CertificatePaginated = {
  id: string;
  name: string;
  createdAt: Date;
  participantsTypes: number;
  activityTypes: number;
};

export type Certificate = {
  id: string;
  name: string;
  template: string;
  createdAt: Date;
  participantType: { id: string; name: string }[];
  activityType: { id: string; name: string }[];
};
