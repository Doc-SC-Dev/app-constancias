import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  activity: ["create", "read", "update", "delete", "list"],
  request: ["create", "read", "update", "delete", "list"],
  qualificationExam: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const STUDENT = ac.newRole({
  ...userAc.statements,
  request: ["create", "read", "list"],
});

export const PROFESSOR = ac.newRole({
  ...userAc.statements,
  activity: ["read", "list"],
  request: ["create", "read", "list"],
});

export const ADMINISTRATOR = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update", "list"],
  request: ["create", "read", "update", "list"],
  qualificationExam: ["create", "read", "update"],
  user: ["ban", "create", "update", "set-role", "set-password", "list", "get"],
});

export const SUPERADMIN = ac.newRole({
  ...adminAc.statements,
  activity: ["create", "read", "update", "delete", "list"],
  request: ["create", "read", "update", "delete", "list"],
  qualificationExam: ["create", "read", "update", "delete"],
});

export enum Roles {
  ADMIN = "ADMINISTRATOR",
  STUDENT = "STUDENT",
  PROFESSOR = "PROFESSOR",
  SUPERADMIN = "SUPERADMIN",
}

export type Role = `${Roles}`;

type AdminRole = Roles.SUPERADMIN | Roles.ADMIN;

export const isAdmin = (role: Role): role is AdminRole => {
  return role === Roles.ADMIN || role === Roles.SUPERADMIN;
};
