import { type } from "arktype";

const studentSchema = type({
  id: "string",
  studentId: "string",
  name: "string",
  email: "string",
  admissionDate: "number",
  isRegular: "boolean",
});

export type Student = typeof studentSchema.infer;
