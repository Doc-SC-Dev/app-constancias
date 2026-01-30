export type UserError =
  | { type: "USER_ALREADY_EXISTS"; message: string }
  | { type: "STUDENT_CREATION_FAILED"; message: string }
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "USER_DOES_NOT_EXISTS"; message: string };
