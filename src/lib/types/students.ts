import { type } from "arktype";

const studentSchema = type({
  id: "number",
  name: "string",
  email: "string",
  admissionDate: "number",
  isRegular: "boolean",
});

export type Student = typeof studentSchema.infer;
