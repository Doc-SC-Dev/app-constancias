import { type } from "arktype";
import type { auth } from "../auth";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;

const roles = type(
  "'administrator' | 'professor' | 'student' | 'superadmin'| 'guest'"
);

export const historyEntrySchema = type({
  id: "string",
  name: "string >= 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]$/,
  role: roles,
  certName: "string >= 1",
  state: "string",
  createdAt: "Date",
  updatedAt: "Date",
  "link?": "string",
  "rejectionReason?": "string",
});

export type HistoryEntry = typeof historyEntrySchema.infer;
