import { type } from "arktype";

export const loginSchema = type({
  email: "string.email",
  password: "string>=1",
});

export type LoginData = typeof loginSchema.infer;
