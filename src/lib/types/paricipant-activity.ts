import { type } from "arktype";
import { activitySchema } from "./activity";
import type { UserWithActivities } from "./users";

export const activityType = type(
  "'DOCENCIA' | 'EXAMEN_CALIFICACION' | 'TRABAJO_INVESTIGACION' | 'TRABAJO_DE_TITULO' | 'PROYECTO_DE_INVESTIGACION' | 'PASANTIA'",
);

export const participantType = type(
  "'CO_AUTOR' | 'AYUDANTE' | 'TESISTA' | 'AUTOR' | 'PROFESOR_ENCARGADO' | 'COLABORADOR' | 'ESTUDIANTE' | 'PASANTE'",
);

export const participantActivitySchema = type({
  id: "string",
  hours: "string | number",
  type: participantType,
  activityName: "string",
  activityType: activityType,
  userName: "string",
  createdAt: "Date",
  updatedAt: "Date",
  activity: activitySchema,
});

export type ParticipantActivity = typeof participantActivitySchema.infer;
export type Participant = UserWithActivities["participants"][number];

export type ActivityParticipantDTO = {
  id: string;
  hours: number;
  typeId: string;
  typeName: string;
  userId: string;
  userName: string;
};

export type UserActivityDTO = {
  activityId: string;
  hours: number;
  activityName: string;
  activityType: string;
  typeId: string;
  typeName: string;
};
