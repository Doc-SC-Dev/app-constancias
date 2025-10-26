import { auth } from "./auth";
import { ROLE_NAMES, type RoleName } from "./permissions";
import { db } from "@/db/drizzle";
import { userRole, role } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper to get current session
export async function getSession() {
  return await auth.api.getSession({
    headers: await import("next/headers").then((h) => h.headers()),
  });
}

// Helper to require authentication
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

// Helper to get user's role from database
export async function getUserRole(userId: string): Promise<RoleName | null> {
  const userRoleRecord = await db
    .select({
      roleName: role.name,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, userId))
    .limit(1);
  
  if (!userRoleRecord.length) {
    return null;
  }
  
  return userRoleRecord[0].roleName as RoleName;
}

// Helper to require a specific role
export async function requireRole(requiredRole: RoleName) {
  const session = await requireAuth();
  const userRole = await getUserRole(session.user.id);
  
  if (!userRole) {
    throw new Error("User role not found");
  }
  
  // Check if user has the required role or higher
  const roleHierarchy = {
    [ROLE_NAMES.LECTOR]: 1,
    [ROLE_NAMES.GESTOR]: 2,
    [ROLE_NAMES.ADMIN]: 3,
  };
  
  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  if (userRoleLevel < requiredRoleLevel) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`);
  }
  
  return { session, userRole };
}

// Helper to check specific permissions
export function hasPermission(userRole: RoleName, resource: string, action: string): boolean {
  // Define permissions for each role
  const permissions = {
    [ROLE_NAMES.ADMIN]: {
      client: ["create", "read", "update", "delete"],
      ingredient: ["create", "read", "update", "delete"],
      recipe: ["create", "read", "update", "delete"],
      product: ["create", "read", "update", "delete"],
      budget: ["create", "read", "update", "delete", "issue", "accept", "reject"],
      user: ["read", "manage"],
      audit: ["read"],
    },
    [ROLE_NAMES.GESTOR]: {
      client: ["create", "read", "update"],
      ingredient: ["create", "read", "update"],
      recipe: ["create", "read", "update"],
      product: ["create", "read", "update"],
      budget: ["create", "read", "update", "issue"],
    },
    [ROLE_NAMES.LECTOR]: {
      client: ["read"],
      ingredient: ["read"],
      recipe: ["read"],
      product: ["read"],
      budget: ["read"],
    },
  };
  
  const rolePermissions = permissions[userRole];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
}

// Helper to require specific permission
export async function requirePermission(resource: string, action: string) {
  const session = await requireAuth();
  const userRole = await getUserRole(session.user.id);
  
  if (!userRole || !hasPermission(userRole, resource, action)) {
    throw new Error(`Permission denied: ${action} on ${resource}`);
  }
  
  return session;
}
