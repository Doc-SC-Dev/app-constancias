export type ActivityError =
  | { type: "ACTIVITY_NAME_EXISTS"; message: string }
  | { type: "PARTICIPANT_CREATION_FAILD"; message: string }
  | { type: "ACTIVITY_NOT_FOUND"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "BAD_REQUEST"; message: string };
