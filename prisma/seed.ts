import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { AcademicGrade, Gender, type Prisma, Role } from "@/generated/prisma";
import {
  ADMINISTRATOR,
  ac,
  PROFESSOR,
  STUDENT,
  SUPERADMIN,
} from "@/lib/authorization/permissions";
import { db } from "../src/lib/db";

type UserInputType = {
  email: string;
  rut: string;
  name: string;
  academicGrade: AcademicGrade;
  gender: Gender;
  role: Role;
  studentId?: number;
};

const users: UserInputType[] = [
  {
    name: "Isidora Acevedo",
    rut: "20.643.500-3",
    email: "isi.acevedog8625@gmail.com",
    academicGrade: AcademicGrade.MAGISTER,
    gender: Gender.FEMALE,
    role: Role.STUDENT,
    studentId: 871249,
  },
  {
    name: "Tomás Alonso Bravo Cañete",
    rut: "20.488.616-4",
    email: "tomas.b.c@outlook.com",
    academicGrade: AcademicGrade.DOCTOR,
    gender: Gender.MALE,
    role: Role.PROFESSOR,
  },
];

const activityTypes: Prisma.ActivityTypeCreateInput[] = [
  {
    name: "Docencia",
    participantTypes: {
      createMany: {
        data: [
          { name: "Profesor encargado", required: true },
          { name: "Profesor invitado" },
          { name: "Colaborador" },
        ],
      },
    },
  },
  {
    name: "Examen de calificación",
    participantTypes: {
      createMany: {
        data: [
          { name: "Estudiante", required: true },
          { name: "Profesor guía", required: true },
          { name: "Profesor co-guia" },
          { name: "Comisión 1" },
          { name: "Comision 2" },
          { name: "Comision 3" },
        ],
      },
    },
  },
  {
    name: "Trabajo de investigación",
    participantTypes: {
      createMany: {
        data: [{ name: "Autor", required: true }, { name: "Co-autor" }],
      },
    },
  },
  {
    name: "Trabajo de título",
    participantTypes: {
      createMany: {
        data: [
          { name: "Estudiante", required: true },
          { name: "Profesor guia", required: true },
          { name: "Profesor co-guia" },
          { name: "Comisión 1" },
          { name: "Comisión 2" },
          { name: "Comisión 3" },
        ],
      },
    },
  },
  {
    name: "Proyecto de investigación",
    participantTypes: {
      createMany: {
        data: [
          { name: "Autor", required: true },
          { name: "Co-autor" },
          { name: "ayudante" },
        ],
      },
    },
  },
  {
    name: "Pasantía",
    participantTypes: {
      createMany: {
        data: [
          { name: "Pasante", required: true },
          { name: "Guía", required: true },
        ],
      },
    },
  },
];
const createUser = async ({
  email,
  rut,
  name,
  academicGrade,
  gender,
  role,
  studentId,
}: UserInputType) => {
  const existUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existUser) {
    console.log("✅ User already exists. Skipping creation.");
  } else {
    console.log(`Creating user with email ${email}`);
    const userResponse = await auth.api.signUpEmail({
      body: {
        email,
        rut,
        name,
        password: `${name}Password123!`,
        academicGrade,
        gender,
      },
    });

    if (!userResponse.user) {
      throw new Error(`Failed to create the user with name ${name}`);
    }

    await db.user.update({
      where: { id: userResponse.user.id },
      data: {
        emailVerified: true,
        role,
      },
    });

    if (role === Role.STUDENT) {
      await db.student.create({
        data: {
          studentId: studentId ?? 0,
          admisionDate: new Date(),
          isRegularStudent: true,
          user: {
            connect: {
              id: userResponse.user.id,
            },
          },
        },
      });
    }
    console.log(`✅ User with email ${email} created successfully.`);
  }
};
const createSuperAdmin = async () => {
  const existingAdmin = await db.user.findFirst({
    where: {
      role: {
        equals: "SUPERADMIN",
      },
    },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists. Skipping creation.");
  } else {
    // Create admin user using Better Auth signUpEmail
    console.log("Creating Superadmin user.");
    const adminUserResponse = await auth.api.signUpEmail({
      body: {
        email: "admin@constancias.cl",
        password: "AdminPassword123!", // Change this password in production
        name: "Administrador",
        rut: "11.111.111-1",
        academicGrade: AcademicGrade.DOCTOR,
        gender: Gender.MALE,
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
        role: Role.SUPERADMIN,
      },
    });

    console.log("✅ Superadmin user created successfully.");
  }
};

const createCertificates = async () => {
  console.log("Checking certificates...");
  const countCertificates = await db.certificate.count();
  if (!countCertificates) {
    console.log("Creating certificates...");
    await db.certificate.createMany({
      data: [
        {
          name: "Constancia de participación",
          pdfLink: "",
          roles: ["STUDENT", "PROFESSOR"],
        },
        {
          name: "Constancia de alumno regular",
          pdfLink: "",
          roles: ["STUDENT"],
        },
        {
          name: "Constancia de examen de calificación",
          pdfLink: "",
          roles: ["PROFESSOR", "STUDENT"],
        },
        {
          name: "Constancia de colaboración",
          pdfLink: "",
          roles: ["PROFESSOR"],
        },
      ],
    });
    console.log("✅ Certificates created successfully");
  }
};

const createActivityTypes = async () => {
  console.log("Checking activity types...");
  const countActivityType = await db.activityType.count();
  if (!countActivityType) {
    console.log("Creating activity types...");
    await Promise.all(
      activityTypes.map((activityType) =>
        db.activityType.create({ data: activityType }),
      ),
    );
    console.log("✅ Activity types created successfully");
  }
};

export const auth = betterAuth({
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
        unique: true,
      },
      academicGrade: {
        type: "string",
        input: true,
        returned: true,
      },
      gender: {
        default: Gender.FEMALE,
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
      roles: { PROFESSOR, SUPERADMIN, STUDENT, ADMINISTRATOR },
      adminRoles: [Role.ADMINISTRATOR, Role.SUPERADMIN],
      defaultRole: Role.STUDENT,
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
});

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Check if admin user already exists
    await createSuperAdmin();
    // create user
    await Promise.all(users.map((user) => createUser(user)));
    // Create certificates
    await createCertificates();

    const testCertName = "Constancia de prueba";
    const testCert = await db.certificate.findUnique({
      where: { name: testCertName },
    });

    if (!testCert) {
      console.log(`Creating ${testCertName}...`);
      await db.certificate.create({
        data: {
          name: testCertName,
          pdfLink: "",
        },
      });
      console.log(`${testCertName} created successfully`);
    }
    // create Activity types of table is emtpty
    await createActivityTypes();

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
