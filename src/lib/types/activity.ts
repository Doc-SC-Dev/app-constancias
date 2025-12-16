import { type } from "arktype";
import { ActivityModel } from "../models";

export const activitySchema = type({
  id: "string",
  name: "string",
  startAt: "Date",
  endAt: "Date",
  nParticipants: "number",
  activityType: "string",
  createdAt: "Date",
  updatedAt: "Date",
});

export const activityDTO = type({
  id: "string",
  activityType: "string",
  name: "string",
  startAt: "string",
  endAt: "string",
  nParticipants: "number",
  encargado: "string",
});

export const toActivityDTO = type.instanceOf(ActivityModel).pipe(
  (activity: ActivityModel): ActivityDTO => ({
    activityType: activity.activityType.name,
    id: activity.id,
    name: activity.name,
    startAt: activity.startAt.toISOString(),
    endAt: activity.endAt.toISOString(),
    nParticipants: activity.nParticipants,
    encargado: activity.participants[0].user.name,
  }),
);

export type ActivityDTO = typeof activityDTO.infer;

export const activityEditSchema = type({
  name: "string",
  startAt: "Date",
  endAt: "Date",
  nParticipants: "1 <= number <= 30",
  activityType: "string",
});

export type ActivityEdit = typeof activityEditSchema.infer;

const participantSchema = type({
  id: "string > 0",
  type: "string",
  hours: "number >= 1",
}).array();

export const activityCreateSchema = type({
  name: "string > 1",
  startAt: "Date",
  endAt: "Date",
  type: "string",
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

export type ActivityCreateDTO = typeof activityCreateSchema.infer;
