import { type } from "arktype";

export const createRequestSchema = type({
  certificateId: "string",
});

export type CreateRequest = typeof createRequestSchema.infer;

export type { Request } from "@/generated/prisma";
