import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  activity: ["create", "read", "update", "delete", "list"],
  request: ["create", "read", "update", "delete", "list"],
  qualificationExam: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const student = ac.newRole({
  ...userAc.statements,
  request: ["create", "read", "list"],
});

export const professor = ac.newRole({
  ...userAc.statements,
  activity: ["read", "list"],
  request: ["create", "read", "list"],
});

export const guest = ac.newRole({
  ...userAc.statements,
  request: ["create", "read", "list"],
  activity: ["read", "list"],
});

export const administrator = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update", "list"],
  request: ["create", "read", "update", "list"],
  qualificationExam: ["create", "read", "update"],
  user: ["ban", "create", "update", "set-role", "set-password", "list", "get"],
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update", "delete", "list"],
  request: ["create", "read", "update", "delete", "list"],
  qualificationExam: ["create", "read", "update", "delete"],
});

export enum Roles {
  ADMIN = "administrator",
  STUDENT = "student",
  PROFESSOR = "professor",
  SUPERADMIN = "superadmin",
  GUEST = "guest",
}

export type Role = `${Roles}`;
