import { type } from "arktype";

export const forgotPasswordSchema = type({
  email: "string.email",
});

export type ForgotPassword = typeof forgotPasswordSchema.infer;
