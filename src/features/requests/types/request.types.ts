import type {
  CertificateTemplate,
  Gender,
  OtherRequest,
  ParticipantType,
  RequestState,
  Role,
} from "@/generated/prisma";

export type RequestUser = {
  id: string; // Required for identity checks
  name: string;
  rut: string | null;
  role: Role;
  gender: Gender;
  academicDegree: { title: { abbrev: string }[] } | null;
  student: {
    studentId: string;
    admisionDate: Date;
    admisionYear: number;
    isRegularStudent: boolean;
  } | null;
  participants?: {
    type: {
      name: string;
    };
  }[];
};

export type RequestActivity = {
  name: string;
  startAt: string;
  endAt: string | null;
  activityType: {
    id: string;
    name: string;
  };
  participants: {
    user: {
      id: string;
      name: string;
      academicDegree: {
        title: { abbrev: string }[];
      } | null;
      gender: Gender;
    };
    hours: number;
    type: ParticipantType;
  }[];
};

export type RequestCertificate = {
  name: string;
  template: CertificateTemplate[]; // Required for template selection
};

// Merged definition representing the single eager query
export type FullRequest = {
  id: string;
  userId: string;
  state: RequestState;
  generatedContent: string | null;
  user: RequestUser;
  activity: RequestActivity | null;
  certificate: RequestCertificate;
  otherRequest: OtherRequest | null;
};
