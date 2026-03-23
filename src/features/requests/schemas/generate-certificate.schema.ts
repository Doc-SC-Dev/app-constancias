import { type } from "arktype";

export const GenerateCertificateSchema = type({
  requestId: "string.uuid",
  user: type({
    id: "string",
    name: "string",
    role: "string",
    gender: "'MALE'| 'FEMALE' | 'OTHER'",
  }),
});

export type GenerateCertificateInput = typeof GenerateCertificateSchema.infer;
