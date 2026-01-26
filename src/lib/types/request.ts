import { type } from "arktype";
import type { Gender, RequestState, Role } from "@/generated/prisma";

export const createRequestSchema = type({
  certificateName: "string",
  userId: "string",
  "activityId?": "string",
  "description?": "string",
});

export type CreateRequest = typeof createRequestSchema.infer;

export type { Request } from "@/generated/prisma";

export enum Certificates {
  ALUMNO_REGULAR = "Constancia de alumno regular",
  PARTICIPACION = "Constancia de participación",
  EXAMEN_CALIFICACION = "Constancia de examen de calificación",
  COLABORACION = "Constancia de colaboración",
  OTHER = "Otra Constancia",
}

export type RequestUserWithParticipants = {
  name: string;
  rut: string;
  role: Role;
  gender: Gender;
  academicDegree: { title: { abbrev: string }[] } | null;
  student: {
    studentId: number;
    admisionDate: Date;
  } | null;
  participants: {
    type: {
      name: string;
    };
  }[];
};
export type RequestUserWithoutParticipant = {
  name: string;
  rut: string;
  role: Role;
  gender: Gender;
  academicDegree: { title: { abbrev: string }[] } | null;
  student: {
    studentId: number;
    admisionDate: Date;
  } | null;
};
export type RequestActivity = {
  name: string;
  startAt: Date;
  endAt: Date | null;
  activityType: {
    name: string;
  };
  participants: {
    user: {
      name: string;
      academicDegree: {
        title: { abbrev: string }[];
      } | null;
      gender: Gender;
    };
    hours: number;
    type: {
      name: string;
    };
  }[];
};

export type RequestCertificate = {
  name: string;
};
export type FullRequest = {
  id: string;
  user: RequestUserWithParticipants | RequestUserWithoutParticipant;
  activity: RequestActivity | null;
  certificate: RequestCertificate;
};

export type UserRequest = {
  id: string;
  name: string;
  createdAt: Date;
  state: RequestState;
};
