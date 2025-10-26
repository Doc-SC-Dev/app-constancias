import { db } from "./drizzle";
import { role, permission, rolePermission, userRole } from "./schema";
import { ROLE_NAMES } from "@/lib/permissions";

export async function seedDatabase() {
    console.log("🌱 Starting database seed...");

    try {
        // Create roles
        const [adminRole, gestorRole, lectorRole] = await db
            .insert(role)
            .values([
                {
                    name: ROLE_NAMES.ADMIN,
                    description: "Full system access with user management capabilities",
                },
                {
                    name: ROLE_NAMES.GESTOR,
                    description: "Can manage clients, ingredients, recipes, products, and budgets",
                },
                {
                    name: ROLE_NAMES.LECTOR,
                    description: "Read-only access to all system data",
                },
            ])
            .returning();

        console.log("✅ Roles created:", adminRole.name, gestorRole.name, lectorRole.name);

        // Create permissions
        const permissions = await db
            .insert(permission)
            .values([
                // Client permissions
                { name: "client.create", description: "Create new clients", resource: "client", action: "create" },
                { name: "client.read", description: "View client information", resource: "client", action: "read" },
                { name: "client.update", description: "Update client information", resource: "client", action: "update" },
                { name: "client.delete", description: "Delete clients", resource: "client", action: "delete" },

                // Ingredient permissions
                { name: "ingredient.create", description: "Create new ingredients", resource: "ingredient", action: "create" },
                { name: "ingredient.read", description: "View ingredient information", resource: "ingredient", action: "read" },
                { name: "ingredient.update", description: "Update ingredient information", resource: "ingredient", action: "update" },
                { name: "ingredient.delete", description: "Delete ingredients", resource: "ingredient", action: "delete" },

                // Recipe permissions
                { name: "recipe.create", description: "Create new recipes", resource: "recipe", action: "create" },
                { name: "recipe.read", description: "View recipe information", resource: "recipe", action: "read" },
                { name: "recipe.update", description: "Update recipe information", resource: "recipe", action: "update" },
                { name: "recipe.delete", description: "Delete recipes", resource: "recipe", action: "delete" },

                // Product permissions
                { name: "product.create", description: "Create new products", resource: "product", action: "create" },
                { name: "product.read", description: "View product information", resource: "product", action: "read" },
                { name: "product.update", description: "Update product information", resource: "product", action: "update" },
                { name: "product.delete", description: "Delete products", resource: "product", action: "delete" },

                // Budget permissions
                { name: "budget.create", description: "Create new budgets", resource: "budget", action: "create" },
                { name: "budget.read", description: "View budget information", resource: "budget", action: "read" },
                { name: "budget.update", description: "Update budget information", resource: "budget", action: "update" },
                { name: "budget.delete", description: "Delete budgets", resource: "budget", action: "delete" },
                { name: "budget.issue", description: "Issue budgets to clients", resource: "budget", action: "issue" },
                { name: "budget.accept", description: "Accept budget proposals", resource: "budget", action: "accept" },
                { name: "budget.reject", description: "Reject budget proposals", resource: "budget", action: "reject" },

                // User permissions
                { name: "user.read", description: "View user information", resource: "user", action: "read" },
                { name: "user.manage", description: "Manage users and roles", resource: "user", action: "manage" },

                // Audit permissions
                { name: "audit.read", description: "View audit logs", resource: "audit", action: "read" },
            ])
            .returning();

        console.log("✅ Permissions created:", permissions.length);

        // Assign permissions to roles
        const rolePermissionMappings = [
            // Admin gets all permissions
            ...permissions.map(p => ({ roleId: adminRole.id, permissionId: p.id })),

            // Gestor gets most permissions except user management and audit
            ...permissions
                .filter(p => !p.name.startsWith("user.") && !p.name.startsWith("audit.") && !p.name.includes("delete"))
                .map(p => ({ roleId: gestorRole.id, permissionId: p.id })),

            // Lector gets only read permissions
            ...permissions
                .filter(p => p.action === "read")
                .map(p => ({ roleId: lectorRole.id, permissionId: p.id })),
        ];

        await db.insert(rolePermission).values(rolePermissionMappings);
        console.log("✅ Role-permission mappings created:", rolePermissionMappings.length);

        console.log("🎉 Database seed completed successfully!");

        return {
            roles: { admin: adminRole, gestor: gestorRole, lector: lectorRole },
            permissions,
        };
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}

// Helper to assign role to user
export async function assignRoleToUser(userId: string, roleName: string) {
    const roleRecord = await db.query.role.findFirst({
        where: (roles, { eq }) => eq(roles.name, roleName),
    });

    if (!roleRecord) {
        throw new Error(`Role ${roleName} not found`);
    }

    await db.insert(userRole).values({
        userId,
        roleId: roleRecord.id,
    });

    console.log(`✅ Assigned role ${roleName} to user ${userId}`);
}