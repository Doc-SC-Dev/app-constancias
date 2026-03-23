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
  ALUMNO_REGULAR = "Constancia de Alumno Regular",
  PARTICIPACION = "Constancia de Participación",
  EXAMEN_CALIFICACION = "Constancia de Examen de Calificación",
  COLABORACION = "Constancia de Colaboración",
  OTHER = "Solicitud Especial",
}

export type RequestUser = {
  name: string;
  rut: string;
  role: Role;
  gender: Gender;
  academicDegree: { title: { abbrev: string }[] } | null;
  student: {
    studentId: number;
    admisionDate: Date;
  } | null;
  participants?: {
    type: {
      name: string;
    };
  }[];
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
  director: {
    name: string;
    gender: Gender;
    academicDegree: { title: { abbrev: string }[] } | null;
  };
  id: string;
  user: RequestUser;
  activity: RequestActivity | null;
  certificate: RequestCertificate;
};

export type UserRequest = {
  id: string;
  name: string;
  createdAt: Date;
  state: RequestState;
};
