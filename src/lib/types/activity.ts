import { type } from "arktype";
import type { Activity } from "@/generated/prisma";
import { ActivityType } from "@/generated/prisma";

export const activityTypeSchema = type.enumerated(
  ...Object.values(ActivityType),
);

export const activitySchema = type({
  id: "string",
  name: "string",
  startAt: "Date",
  endAt: "Date",
  nParticipants: "number",
  activityType: activityTypeSchema,
  createdAt: "Date",
  updatedAt: "Date",
});

export const activityEditSchema = type({
  name: "string",
  startAt: "Date",
  endAt: "Date",
  nParticipants: "1 <= number <= 30",
  activityType: activityTypeSchema,
});

export type ActivityEdit = typeof activityEditSchema.infer;

export type ActivityWithUser = Activity & {
  professor: string;
};
const participantSchema = type({
  id: "string > 0",
  type: "'CO_AUTOR' | 'AYUDANTE' | 'TESISTA' | 'AUTOR' | 'PROFESOR_ENCARGADO' | 'COLABORADOR' | 'ESTUDIANTE' | 'PASANTE'",
  hours: "number >= 1",
}).array();

export const activityCreateSchema = type({
  name: "string > 1",
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

export {
  type Activity,
  ActivityType,
  ParticipantType,
} from "@/generated/prisma";
