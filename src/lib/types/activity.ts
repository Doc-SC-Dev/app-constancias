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
  endAt: "string | undefined",
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

const participantIdSchema = type("string").narrow((s, ctx) => {
  if (s.length === 0) {
    return ctx.reject({
      code: "predicate",
      message: "Debe seleccionar un usuario",
    });
  }
  return true;
});

const participantHoursSchema = type("number").narrow((n, ctx) => {
  if (n < 1) {
    return ctx.reject({
      code: "predicate",
      message: "Las horas deben ser mayor a 0",
    });
  }
  return true;
});

const participantSchema = type({
  id: participantIdSchema,
  type: "string",
  hours: participantHoursSchema,
  bloqueado: "boolean",
})
  .array()
  .narrow((value, ctx) => {
    const allUnique =
      new Set<string>(value.map((v) => v.id)).size === value.length;

    if (!allUnique) {
      return ctx.reject({
        message: "No debes repetir participantes",
        code: "predicate",
      });
    }

    const allValid = value.every((v) => v.id.length > 0 && v.hours > 0);
    if (!allValid) {
      return ctx.reject({
        message: "Se deben completar todos los campos",
        code: "predicate",
      });
    }

    return true;
  });

export const activityEditSchema = type({
  name: "string",
  startAt: "Date",
  endAt: "Date | undefined",
  nParticipants: "1 <= number <= 30",
  activityType: "string",
  participants: participantSchema,
});

export type ActivityParticipant = typeof participantSchema.infer;
export type ActivityEdit = typeof activityEditSchema.infer;

export const activityCreateSchema = type({
  name: type("string").narrow((s, ctx) => {
  if (s.length < 2) {
    return ctx.reject({
      code: "predicate",
      message: "El nombre debe tener al menos 2 caracteres",
    });
  }
  return true;
}),
  date: type({ to: "Date | undefined ", from: "Date" }),

  type: type("string").narrow((value, ctx) =>
    value.length === 0
      ? ctx.reject({
        message: "Debes seleccionar un tipo de actividad",
        code: "predicate",
      })
      : true,
  ),
  participants: participantSchema,
}).narrow((value, ctx) => {
  if (!value.date.to) return true;
  if (value.date.to.getTime() <= value.date.from.getTime()) {
    return ctx.reject({
      message: "La fecha de fin debe ser mayor a la fecha de inicio",
      code: "predicate",
      path: ["date"],
    });
  }
  return true;
});

export type ActivityCreateDTO = typeof activityCreateSchema.infer;

export type Activity = {
  participants: {
    name: string;
    userId: string;
    typeId: string;
    type: string;
    hours: number;
  }[];
  id: string;
  type: string;
  typeId: string;
  name: string;
  startAt: Date;
  endAt: Date | null;
};

export const activityUpdateSchema = type({
  date: type({ to: "Date | undefined ", from: "Date" }),
  participants: participantSchema,
});

export type ActivityUpdateType = typeof activityUpdateSchema.infer;
