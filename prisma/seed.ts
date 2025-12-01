import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { v4 as uuid } from "uuid";
import { db } from "../src/lib/db";

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
      where: {
        role: {
          equals: "superadmin",
        },
      },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists. Skipping creation.");
    } else {
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
      await db.user.update({
        where: { id: adminUserResponse.user.id },
        data: {
          role: "superadmin",
          emailVerified: true,
        },
      });
    }

    await db.certificate.createMany({
      data: [
        {
          name: "Constancia de participación",
          pdfLink: "",
          id: uuid(),
        },
        {
          name: "Constancia de alumno regular",
          pdfLink: "",
          id: uuid(),
        },
        {
          name: "Constancia de examen de calificación",
          pdfLink: "",
          id: uuid(),
        },
        {
          name: "Constancia de colaboración",
          pdfLink: "",
          id: uuid(),
        },
      ],
    });

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
