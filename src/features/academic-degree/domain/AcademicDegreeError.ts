export type AcademicDegreeError =
  | { type: "NOT_FOUND"; message: string }
  | { type: "DUPLICATED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "UNEXPECTED_ERROR"; message: string };
