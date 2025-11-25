import { type } from "arktype";

export const createCertificateSchema = type({
  name: "string > 1",
});

export type CreateCertificate = typeof createCertificateSchema.infer;
