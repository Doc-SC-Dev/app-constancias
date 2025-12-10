import { type } from "arktype";
import { ActivityType } from "@/generated/prisma";

export const activityTypeSchema = type.enumerated(
  ...Object.values(ActivityType)
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

export type Activity = typeof activitySchema.infer;

export const activityEditSchema = type({
  name: "string",
  startAt: "Date",
  endAt: "Date",
  nParticipants: "1 <= number <= 30",
  activityType: activityTypeSchema,
});

export type ActivityEdit = typeof activityEditSchema.infer;
