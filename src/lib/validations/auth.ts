import { type } from "arktype";

// Auth schemas
export const loginSchema = type({
    email: "string.email",
    password: "string > 8",
});

export const userSchema = type({
    name: "string > 0",
    email: "string.email",
    status: "'active' | 'inactive' | 'suspended' = 'active'",
});

export const roleSchema = type({
    name: "string > 0",
    description: "string?",
});

export const permissionSchema = type({
    name: "string > 0",
    description: "string?",
    resource: "string > 0",
    action: "string > 0",
});

export const userRoleSchema = type({
    userId: "string > 0",
    roleId: "string > 0",
});

// Export types
export type LoginInput = typeof loginSchema.infer;
export type UserInput = typeof userSchema.infer;
export type RoleInput = typeof roleSchema.infer;
export type PermissionInput = typeof permissionSchema.infer;
export type UserRoleInput = typeof userRoleSchema.infer;
