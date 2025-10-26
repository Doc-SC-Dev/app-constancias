import { createAccessControl } from "better-auth/plugins/access";

// Define resources and actions in the catering system
export const statement = {
  client: ["create", "read", "update", "delete"],
  ingredient: ["create", "read", "update", "delete"],
  recipe: ["create", "read", "update", "delete"],
  product: ["create", "read", "update", "delete"],
  budget: ["create", "read", "update", "delete", "issue", "accept", "reject"],
  user: ["read", "manage"],
  audit: ["read"],
} as const;

// Create the access controller
export const ac = createAccessControl(statement);

// Define roles based on the RBAC matrix from the plan
export const lector = ac.newRole({
  client: ["read"],
  ingredient: ["read"],
  recipe: ["read"],
  product: ["read"],
  budget: ["read"],
});

export const gestor = ac.newRole({
  client: ["create", "read", "update"],
  ingredient: ["create", "read", "update"],
  recipe: ["create", "read", "update"],
  product: ["create", "read", "update"],
  budget: ["create", "read", "update", "issue"],
});

export const admin = ac.newRole({
  client: ["create", "read", "update", "delete"],
  ingredient: ["create", "read", "update", "delete"],
  recipe: ["create", "read", "update", "delete"],
  product: ["create", "read", "update", "delete"],
  budget: ["create", "read", "update", "delete", "issue", "accept", "reject"],
  user: ["read", "manage"],
  audit: ["read"],
});

// Export role names for easy reference
export const ROLE_NAMES = {
  ADMIN: "admin",
  GESTOR: "gestor", 
  LECTOR: "lector",
} as const;

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];
