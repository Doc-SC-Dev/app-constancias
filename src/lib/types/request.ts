import { type } from "arktype";

export const createRequestSchema = type({
  certificateName: "string",
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
  TESIS = "Constancia de tesis",
} 
