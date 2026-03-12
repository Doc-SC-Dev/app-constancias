import { type } from "arktype";

export const GenerateCertificateSchema = type({
  requestId: "string.uuid",
});

export type GenerateCertificateInput = typeof GenerateCertificateSchema.infer;
