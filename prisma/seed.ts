import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../src/generated/prisma/client.js";

const db = new PrismaClient();

const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      rut: {
        type: "string",
        required: true,
        input: true,
        returned: true,
      },
    },
  },
  plugins: [],
});

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Check if admin user already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists. Skipping creation.");
      return;
    }

    // Create admin user using Better Auth signUpEmail
    const adminUserResponse = await auth.api.signUpEmail({
      body: {
        email: "admin@constancias.cl",
        password: "AdminPassword123!", // Change this password in production
        name: "Administrador",
        rut: "11.111.111-1",
      },
    });

    // Check if the response has a user (successful creation)
    if (!adminUserResponse.user) {
      throw new Error("Failed to create admin user");
    }

    // Update the user role to admin and verify email
    const adminUser = await db.user.update({
      where: { id: adminUserResponse.user.id },
      data: {
        role: "admin",
        emailVerified: true,
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   RUT: ${adminUser.rut}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log("\n⚠️  Credentials:");
    console.log(`   Email: admin@constancias.cl`);
    console.log(`   Password: AdminPassword123!`);
    console.log("\n⚠️  Please change the default password in production!");

    console.log("\n🎉 Database seed completed!");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
