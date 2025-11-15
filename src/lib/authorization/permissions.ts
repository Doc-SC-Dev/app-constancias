import type { keyof } from "better-auth";
import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  activity: ["create", "read", "update", "delete"],
  request: ["create", "read", "update", "delete"],
  qualificationExam: ["create", "read", "update", "delete"],
  guest: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const student = ac.newRole({
  ...userAc.statements,
  request: ["create", "read"],
});

export const professor = ac.newRole({
  ...userAc.statements,
  activity: ["read"],
  request: ["create", "read"],
  guest: ["create", "read"],
});

export const guest = ac.newRole({
  ...userAc.statements,
  activity: ["read"],
  request: ["create", "read"],
});

export const administrator = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update"],
  request: ["create", "read", "update"],
  qualificationExam: ["create", "read", "update"],
  guest: ["create", "read", "update"],
  user: ["ban", "create", "update", "set-role", "set-password", "list", "get"],
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update", "delete"],
  request: ["create", "read", "update", "delete"],
  qualificationExam: ["create", "read", "update", "delete"],
  guest: ["create", "read", "update", "delete"],
});

export enum Roles {
  ADMIN = "administrator",
  STUDENT = "student",
  PROFESSOR = "professor",
  SUPERADMIN = "superadmin",
  GUEST = "guest",
}

export type Role = `${Roles}`;
