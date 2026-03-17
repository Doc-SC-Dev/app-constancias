import { type } from "arktype";

export const CreateActivityTypeSchema = type({
  name: "string >= 2",
  participantTypes: type({
    name: "string >= 2",
    required: "boolean",
  }).array(),
});

export const CreateParticipantTypeSchema = type({
  name: "string >= 2",
  required: "boolean",
  roles: "('STUDENT' | 'PROFESSOR' | 'ADMINISTRATOR' | 'SUPERADMIN')[]",
  activityTypeId: "string",
});

export const UpdateParticipantTypeSchema = type({
  id: "string",
  name: "string >= 2",
  required: "boolean",
  roles: "('STUDENT' | 'PROFESSOR' | 'ADMINISTRATOR' | 'SUPERADMIN')[]",
  activityTypeId: "string",
});

export const UpdateActivityTypeNameSchema = type({
  id: "string",
  name: type("string >= 2")
    .configure({
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .pipe((value) => value.trim()),
});

export type CreateActivityTypeFormDto = typeof CreateActivityTypeSchema.infer;
export type CreateParticipantTypeForm =
  typeof CreateParticipantTypeSchema.infer;
export type UpdateParticipantTypeForm =
  typeof UpdateParticipantTypeSchema.infer;

export type UpdateActivityTypeNameForm =
  typeof UpdateActivityTypeNameSchema.infer;
