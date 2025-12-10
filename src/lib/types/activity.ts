import { type } from "arktype";

export type { Activity } from "@/generated/prisma";
export { ActivityType, ParticipantType } from "@/generated/prisma";

const activityTypeSchema = type(
  "'DOCENCIA' | 'EXAMEN_CALIFICACION' | 'TRABAJO_INVESTIGACION' | 'TRABAJO_DE_TITULO' | 'PROYECTO_DE_INVESTIGACION' | 'PASANTIA'",
).and("string >= 1");

const participantSchema = type({
  id: "string.uuid",
  type: "'CO_AUTOR' | 'AYUDANTE' | 'TESISTA' | 'AUTOR' | 'PROFESOR_ENCARGADO' | 'COLABORADOR' | 'ESTUDIANTE' | 'PASANTE'",
  hours: "number >= 1",
}).array();

export const activityCreateSchema = type({
  name: "string > 1",
  description: "string > 1",
  startAt: "Date",
  endAt: "Date",
  type: activityTypeSchema,
  participants: participantSchema,
}).narrow((value, ctx) => {
  if (value.startAt > value.endAt)
    return ctx.reject({
      message: "La fecha de fin debe ser mayor a la fecha de inicio",
      code: "predicate",
      path: ["endAt"],
    });
  return true;
});

export type ActivityCreateInput = typeof activityCreateSchema.infer;
