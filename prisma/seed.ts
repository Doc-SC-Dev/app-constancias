import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { v4 as uuid } from "uuid";
import {
  ac,
  administrator,
  guest,
  professor,
  student,
  superadmin,
} from "@/lib/authorization/permissions";
import { db } from "../src/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      rut: {
        type: "string",
        required: true,
        input: true,
        returned: true,
        unique: true,
      },
      academicGrade: {
        type: "string",
        input: true,
        returned: true,
      },
      genre: {
        default: "FEMALE",
        required: true,
        type: "string",
        input: true,
        returned: true,
      },
    },
  },
  plugins: [
    admin({
      ac: ac,
      roles: { professor, guest, superadmin, student, administrator },
      adminRoles: ["administrator", "superadmin"],
      defaultRole: "guest",
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
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
          academicGrade: "DOCTOR",
          genre: "FEMALE",
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
          emailVerified: true,
        },
      });
    }

    // Create certificates
    console.log("Checking certificates...");
    const countCertificates = await db.certificate.count();
    if (!countCertificates) {
      console.log("Creating certificates...");
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
      console.log("Certificates created successfully");
    }
    // create Activity types of table is emtpty
    console.log("Checking activity types...");
    const countActivityType = await db.activityType.count();
    if (!countActivityType) {
      console.log("Creating activity types...");
      await db.activityType.createMany({
        data: [
          { name: "Docencia" },
          { name: "Examen de calificación" },
          { name: "Trabajo de investigación" },
          { name: "Trabajo de título" },
          { name: "Proyecto de investigación" },
          { name: "Pasantía" },
        ],
      });
      console.log("Activity types created successfully");
    }

    const docencia = await db.activityType.findUnique({
      where: {
        name: "Docencia",
      },
    });

    const trabajoInvestigacion = await db.activityType.findUnique({
      where: {
        name: "Trabajo de investigación",
      },
    });

    const examenCalificacion = await db.activityType.findUnique({
      where: {
        name: "Examen de calificación",
      },
    });

    const trabajoTitulo = await db.activityType.findUnique({
      where: {
        name: "Trabajo de título",
      },
    });
    //creating Participant types
    console.log("Checking participant types...");
    const countParticipantType = await db.participantType.count();
    if (!countParticipantType) {
      console.log("Creating participant types...");
      await db.participantType.createMany({
        data: [
          { name: "Co-autor", activityTypeId: trabajoInvestigacion?.id },
          { name: "Ayudante", activityTypeId: docencia?.id },
          { name: "Estudiante", activityTypeId: trabajoTitulo?.id },
          {
            name: "Profesor encargado",
            activityTypeId: examenCalificacion?.id,
          },
          { name: "Autor", activityTypeId: trabajoInvestigacion?.id },
          { name: "Profesor encargado", activityTypeId: docencia?.id },
          { name: "Colaborador", activityTypeId: docencia?.id },
          { name: "Estudiante", activityTypeId: examenCalificacion?.id },
          { name: "Pasante", activityTypeId: trabajoInvestigacion?.id },
          { name: "Profesor Adjunto", activityTypeId: docencia?.id },
        ],
      });
      console.log("Participant types created successfully");
    }
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
