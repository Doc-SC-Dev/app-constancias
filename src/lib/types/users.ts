import { type } from "arktype";
import type { auth } from "../auth";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;

const roles = type(
  "'administrator' | 'professor' | 'student' | 'superadmin'| 'guest'",
);

export const userEditSchema = type({
  name: "string >= 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: roles,
});

export type UserEdit = typeof userEditSchema.infer;

export const userCreateSchema = type({
  name: "string > 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: roles,
  "studentId?": "string.numeric",
});

export type UserCreate = typeof userCreateSchema.infer;
