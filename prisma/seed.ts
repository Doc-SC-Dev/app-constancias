import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { Gender, type Prisma, Role } from "@/generated/prisma";
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
  academicDegreeId: string;
  gender: Gender;
  role: Role;
  studentId?: number;
};

const degrees: Prisma.AcademicDegreeCreateInput[] = [
  {
    name: "Doctorado",
    title: {
      createMany: {
        data: [
          {
            gender: Gender.FEMALE,
            abbrev: "Dra.",
          },
          {
            gender: Gender.MALE,
            abbrev: "Dr.",
          },
        ],
      },
    },
  },
  {
    name: "Magister",
    title: {
      createMany: {
        data: [
          {
            gender: Gender.FEMALE,
            abbrev: "Mg.",
          },
          {
            gender: Gender.MALE,
            abbrev: "Mg.",
          },
        ],
      },
    },
  },
];

const createAcademicDegree = async () => {
  console.log("Creando Grados...");
  await db.academicDegree.createMany({
    data: degrees,
  });

  console.log("Grados creados exitosamente.");
  const doctorate = await db.academicDegree.findFirstOrThrow({
    where: {
      name: "Doctorado",
    },
  });
  return doctorate;
};

const users: UserInputType[] = [
  {
    name: "Isidora Acevedo",
    rut: "20.643.500-3",
    email: "isi.acevedog8625@gmail.com",
    gender: Gender.FEMALE,
    role: Role.STUDENT,
    studentId: 871249,
    academicDegreeId: "",
  },
  {
    name: "Tomás Alonso Bravo Cañete",
    rut: "20.488.616-4",
    email: "tomas.b.c@outlook.com",
    gender: Gender.MALE,
    role: Role.PROFESSOR,
    academicDegreeId: "",
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
  gender,
  academicDegreeId,
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
        academicDegreeId,
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
const createSuperAdmin = async ({ doctorateId }: { doctorateId: string }) => {
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
        academicDegreeId: doctorateId,
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
      academicDegreeId: {
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

function addMonths(fecha: Date, meses: number): Date {
  const d = new Date(fecha);

  // Guardamos el día original (ej: 31)
  const diaOriginal = d.getDate();

  // Establecemos el día a 1 para evitar errores prematuros al cambiar de mes
  d.setDate(1);

  // Sumamos los meses
  d.setMonth(d.getMonth() + meses);

  // Verificamos cuántos días tiene el nuevo mes
  // (El día 0 del mes siguiente es el último día del mes actual)
  const diasEnNuevoMes = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();

  // Ajustamos: si el día original es mayor al máximo del nuevo mes, usamos el máximo.
  d.setDate(Math.min(diaOriginal, diasEnNuevoMes));

  return d;
}

async function createAcademicPeriod() {
  const today = new Date();
  await db.academicPeriod.create({
    data: {
      createdBy: "Tomás Alonso Bravo Cañete",
      name: "2026-1",
      startDate: today,
      endDate: addMonths(today, 6),
      active: true,
    },
  });
}

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    const doctorate = await createAcademicDegree();
    // Check if admin user already exists
    await createSuperAdmin({ doctorateId: doctorate.id });
    // create user
    await Promise.all(
      users.map((user) =>
        createUser({ ...user, academicDegreeId: doctorate.id }),
      ),
    );
    // Create certificates
    await createCertificates();

    const testCertName = "Constancia Especial";
    const testCert = await db.certificate.findUnique({
      where: { name: testCertName },
    });

    if (!testCert) {
      console.log(`Creating ${testCertName}...`);
      await db.certificate.create({
        data: {
          name: testCertName,
          pdfLink: "",
          roles: ["PROFESSOR", "STUDENT"],
        },
      });
      console.log(`${testCertName} created successfully`);
    }
    // create Activity types of table is emtpty
    await createActivityTypes();
    await createAcademicPeriod();

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
