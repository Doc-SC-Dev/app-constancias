/**
 * seed.ts — Script de carga inicial de datos desde Excel a PostgreSQL vía Prisma
 *
 * Uso:
 *   npx prisma db seed
 *   npx tsx prisma/seed.ts
 *
 * Prerequisitos:
 *   - DATABASE_URL configurada en .env
 *   - pnpm add -D tsx xlsx
 *   - El archivo Excel en la ruta indicada en EXCEL_PATH
 *
 * Columnas requeridas en la hoja User (además de las existentes):
 *   - password: contraseña en texto plano (será hasheada con scrypt antes de guardar)
 *
 * El Excel debe tener datos a partir de la fila 7 (las 6 primeras son metadatos).
 * Orden de inserción respeta las dependencias de FK del schema.
 */

import "dotenv/config";
import * as path from "node:path";
import { hashPassword } from "better-auth/crypto";
import XLSX from "xlsx";

import { db } from "@/lib/db";
import { type Gender, Role } from "../src/generated/prisma";

const prisma = db;

const EXCEL_PATH = path.resolve(import.meta.dirname, "data/estructura_bd.xlsx");
const DATA_START_ROW = 6;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function readSheet<T>(
  workbook: XLSX.WorkBook,
  sheetName: string,
  headerRow: number = DATA_START_ROW,
): T[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Hoja "${sheetName}" no encontrada en el Excel`);
  const rows = XLSX.utils.sheet_to_json<T>(sheet, {
    range: headerRow - 1,
    defval: null,
  });
  return rows.filter((row) =>
    Object.values(row as object).some((v) => v !== null && v !== ""),
  );
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value === 1;
  return false;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    return XLSX.SSF.parse_date_code(value) as unknown as Date;
  }
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseRoles(value: unknown): Role[] {
  if (!value) return [Role.STUDENT, Role.PROFESSOR];
  const raw = String(value);
  return raw
    .split(",")
    .map((r) => r.trim().toUpperCase())
    .filter((r) => Object.values(Role).includes(r as Role)) as Role[];
}

function parseGender(value: unknown): Gender {
  const raw = String(value ?? "").toUpperCase();
  if (raw === "MALE" || raw === "FEMALE" || raw === "OTHER")
    return raw as Gender;
  throw new Error(
    `Valor de género inválido: "${value}". Debe ser MALE, FEMALE u OTHER`,
  );
}

// ─────────────────────────────────────────────
// Seeders
// ─────────────────────────────────────────────

async function seedAcademicDegrees(wb: XLSX.WorkBook) {
  console.log("  → AcademicDegree...");
  interface Row {
    id: string;
    name: string;
  }
  const rows = readSheet<Row>(wb, "AcademicDegree");
  for (const row of rows) {
    if (!row.name) continue;
    await prisma.academicDegree.upsert({
      where: { name: row.name },
      update: {},
      create: { id: row.id || undefined, name: row.name },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedAcademicTitles(wb: XLSX.WorkBook) {
  console.log("  → AcademicTitle...");
  interface Row {
    id: string;
    academicDegreeId: string;
    AcademicDegreeName: string;
    gender: string;
    abbrev: string;
  }
  const rows = readSheet<Row>(wb, "AcademicTitle");
  for (const row of rows) {
    if (!row.abbrev) continue;
    let degreeId = row.academicDegreeId;
    if (!degreeId && row.AcademicDegreeName) {
      const degree = await prisma.academicDegree.findFirst({
        where: { name: row.AcademicDegreeName },
      });
      if (!degree) {
        console.warn(
          `     ⚠ AcademicTitle: grado "${row.AcademicDegreeName}" no encontrado, saltando`,
        );
        continue;
      }
      degreeId = degree.id;
    }

    await prisma.academicTitle.upsert({
      where: { id: row.id || "non-existent-id" },
      update: { abbrev: row.abbrev, gender: parseGender(row.gender) },
      create: {
        id: row.id || undefined,
        academicDegreeId: degreeId,
        gender: parseGender(row.gender),
        abbrev: row.abbrev,
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedUsers(wb: XLSX.WorkBook) {
  console.log("  → User + Account (Better Auth)...");
  interface Row {
    id: string;
    rut: string;
    name: string;
    email: string;
    emailVerified: unknown;
    image: string | null;
    role: string;
    banned: unknown;
    banReason: string | null;
    banExpires: unknown;
    gender: string;
    isDirector: unknown;
    academicDegreeId: string | null;
    academicDegreeName: string | null;
  }
  const rows = readSheet<Row>(wb, "User");

  for (const row of rows) {
    if (!row.rut || !row.email) continue;

    let degreeId = row.academicDegreeId || null;
    if (!degreeId && row.academicDegreeName) {
      const degree = await prisma.academicDegree.findFirst({
        where: { name: row.academicDegreeName },
      });
      degreeId = degree?.id ?? null;
    }

    const role =
      (String(row.role ?? "STUDENT").toUpperCase() as Role) || Role.STUDENT;

    const existingUser = await prisma.user.findUnique({
      where: { email: row.email.trim() },
      include: { accounts: { where: { providerId: "credential" } } },
    });

    if (existingUser) {
      // Actualiza datos del perfil sin romper la sesión existente
      await prisma.user.update({
        where: { email: row.email.trim() },
        data: {
          name: row.name.trim(),
          role,
          gender: parseGender(row.gender),
          isDirector: parseBoolean(row.isDirector),
          banned: parseBoolean(row.banned),
          banReason: row.banReason || null,
          academicDegreeId: degreeId,
        },
      });
      // Actualiza la contraseña si ya tiene cuenta credential
      if (existingUser.accounts.length > 0) {
        const password =
          String(row.rut).length === 0 ? row.name : row.rut.replace(".", "");
        const hashedPassword = await hashPassword(password);
        await prisma.account.update({
          where: { id: existingUser.accounts[0].id },
          data: { password: hashedPassword },
        });
      }
      continue;
    }

    // Usuario nuevo — hashea con scrypt (mismo algoritmo que usa Better Auth internamente)
    const password =
      String(row.rut).length === 0 ? row.name : row.rut.replace(".", "");
    const hashedPassword = await hashPassword(password);
    const userId = row.id || crypto.randomUUID();
    const now = new Date();

    // Transacción atómica: sin Account con providerId "credential",
    // Better Auth no puede autenticar al usuario aunque exista en User
    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: userId,
          rut: row.rut.length ? row.rut.trim() : null,
          name: row.name.trim(),
          email: row.email.trim(),
          emailVerified: parseBoolean(row.emailVerified),
          image: row.image || null,
          role,
          banned: parseBoolean(row.banned),
          banReason: row.banReason || null,
          banExpires: parseDate(row.banExpires),
          gender: parseGender(row.gender),
          isDirector: parseBoolean(row.isDirector),
          academicDegreeId: degreeId,
        },
      }),
      prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: userId, // Better Auth usa el userId como accountId en credentials
          providerId: "credential", // Valor fijo que usa Better Auth para email/password
          userId,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ]);
  }

  console.log(`     ${rows.length} registros procesados`);
}

async function seedStudents(wb: XLSX.WorkBook) {
  console.log("  → Student...");
  interface Row {
    id: string;
    studentId: string;
    userName: string;
    userId: string;
    isRegularStudent: unknown;
    admisionDate: unknown;
  }
  const rows = readSheet<Row>(wb, "Student");
  for (const row of rows) {
    if (!row.studentId) continue;
    let userId = row.userId;
    if (!userId && row.userName) {
      const user = await prisma.user.findFirst({
        where: { name: row.userName },
      });
      if (!user) {
        console.warn(
          `     ⚠ Student: usuario "${row.userName}" no encontrado, saltando`,
        );
        continue;
      }
      userId = user.id;
    }
    await prisma.student.upsert({
      where: { studentId: row.studentId },
      update: {
        isRegularStudent: parseBoolean(row.isRegularStudent),
        admisionDate: parseDate(row.admisionDate) ?? new Date(),
      },
      create: {
        id: row.id || undefined,
        studentId: row.studentId,
        userId,
        isRegularStudent: parseBoolean(row.isRegularStudent),
        admisionDate: parseDate(row.admisionDate) ?? new Date(),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedActivityTypes(wb: XLSX.WorkBook) {
  console.log("  → ActivityType...");
  interface Row {
    id: string;
    name: string;
  }
  const rows = readSheet<Row>(wb, "ActivityType");
  for (const row of rows) {
    if (!row.name) continue;
    await prisma.activityType.upsert({
      where: { name: row.name.trim() },
      update: {},
      create: { id: row.id || undefined, name: row.name.trim() },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedActivities(wb: XLSX.WorkBook) {
  console.log("  → Activity...");
  interface Row {
    id: string;
    activityTypeName: string;
    activityTypeId: string;
    name: string;
    startAt: unknown;
    endAt: unknown;
    nAssistant: number | null;
    nParticipant: number;
  }
  const rows = readSheet<Row>(wb, "Activity");
  for (const row of rows) {
    if (!row.name) continue;
    let activityTypeId = row.activityTypeId;
    if (!activityTypeId && row.activityTypeName) {
      const type = await prisma.activityType.findFirst({
        where: { name: row.activityTypeName.trim() },
      });
      if (!type) {
        console.warn(
          `     ⚠ Activity: tipo "${row.activityTypeName}" no encontrado, saltando`,
        );
        continue;
      }
      activityTypeId = type.id;
    }
    const startAt = parseDate(row.startAt);
    if (!startAt) {
      console.warn(
        `     ⚠ Activity "${row.name}": fecha de inicio inválida, saltando`,
      );
      continue;
    }
    await prisma.activity.upsert({
      where: { id: row.id || "non-existent-id" },
      update: {
        name: row.name.trim(),
        startAt,
        endAt: parseDate(row.endAt),
        nAssistant: row.nAssistant ? Number(row.nAssistant) : null,
        nParticipants: Number(row.nParticipant) || 1,
      },
      create: {
        id: row.id || undefined,
        activityTypeId,
        name: row.name.trim(),
        startAt,
        endAt: parseDate(row.endAt),
        nAssistant: row.nAssistant ? Number(row.nAssistant) : null,
        nParticipants: Number(row.nParticipant) || 1,
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedParticipantTypes(wb: XLSX.WorkBook) {
  console.log("  → ParticipantType...");
  interface Row {
    id: string;
    name: string;
    roles: unknown;
    activityTypeName: string;
    activityTypeId: string;
    min: string;
    max: string;
  }
  const rows = readSheet<Row>(wb, "ParticipantType");
  for (const row of rows) {
    if (!row.name) continue;
    let activityTypeId = row.activityTypeId || null;
    if (!activityTypeId && row.activityTypeName) {
      const type = await prisma.activityType.findFirst({
        where: { name: row.activityTypeName.trim() },
      });
      activityTypeId = type?.id ?? null;
    }
    await prisma.participantType.upsert({
      where: { id: row.id || "non-existent-id" },
      update: {
        name: row.name.trim(),
        roles: parseRoles(row.roles),
        maxCapacity: Number.isNaN(row.max) ? 0 : Number(row.max),
        minCapacity: Number(row.min),
      },
      create: {
        id: row.id || undefined,
        name: row.name.trim(),
        roles: parseRoles(row.roles),
        activityTypeId,
        maxCapacity: Number.isNaN(row.max) ? 0 : Number(row.max),
        minCapacity: Number(row.min),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedParticipants(wb: XLSX.WorkBook) {
  console.log("  → Participant...");
  interface Row {
    id: string;
    activityName: string;
    userName: string;
    participantTypeName: string;
    activityId: string;
    userId: string;
    participantTypeId: string;
    hours: number;
    startAt: unknown;
    endAt: unknown;
  }
  const rows = readSheet<Row>(wb, "Participant");
  for (const row of rows) {
    if (!row.activityName && !row.activityId) continue;
    let activityId = row.activityId;
    if (!activityId && row.activityName) {
      const activity = await prisma.activity.findFirst({
        where: { name: row.activityName },
      });
      if (!activity) {
        console.warn(
          `     ⚠ Participant: actividad "${row.activityName}" no encontrada, saltando`,
        );
        continue;
      }
      activityId = activity.id;
    }
    let userId = row.userId;
    if (!userId && row.userName) {
      const user = await prisma.user.findFirst({
        where: { name: row.userName.trim() },
      });
      if (!user) {
        console.warn(
          `     ⚠ Participant: usuario "${row.userName}" no encontrado, saltando`,
        );
        continue;
      }
      userId = user.id;
    }
    let participantTypeId = row.participantTypeId;
    if (!participantTypeId && row.participantTypeName) {
      const type = await prisma.participantType.findFirst({
        where: { name: row.participantTypeName.trim() },
      });
      if (!type) {
        console.warn(
          `     ⚠ Participant: tipo "${row.participantTypeName}" no encontrado, saltando`,
        );
        continue;
      }
      participantTypeId = type.id;
    }
    await prisma.participant.upsert({
      where: { id: row.id || "non-existent-id" },
      update: {
        hours: Number(row.hours) || 0,
        startAt: parseDate(row.startAt),
        endAt: parseDate(row.endAt),
      },
      create: {
        id: row.id || undefined,
        activityId,
        userId,
        participantTypeId,
        hours: Number(row.hours) || 0,
        startAt: parseDate(row.startAt),
        endAt: parseDate(row.endAt),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedCertificates(wb: XLSX.WorkBook) {
  console.log("  → Certificate...");
  interface Row {
    id: string;
    name: string;
    roles: unknown;
  }
  const rows = readSheet<Row>(wb, "Certificate");
  for (const row of rows) {
    if (!row.name) continue;
    await prisma.certificate.upsert({
      where: { name: row.name.trim() },
      update: { roles: parseRoles(row.roles) },
      create: {
        id: row.id || undefined,
        name: row.name.trim(),
        roles: parseRoles(row.roles),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedCertificateTemplates(wb: XLSX.WorkBook) {
  console.log("  → CertificateTemplate...");
  interface Row {
    id: string;
    certificateName: string;
    certificateId: string;
    role: string | null;
    activityTypeId: string | null;
    participantTypeId: string | null;
    template: string;
  }
  const rows = readSheet<Row>(wb, "CertificateTemplate");
  for (const row of rows) {
    if (!row.template) continue;
    let certificateId = row.certificateId;
    if (!certificateId && row.certificateName) {
      const cert = await prisma.certificate.findFirst({
        where: { name: row.certificateName },
      });
      if (!cert) {
        console.warn(
          `     ⚠ Template: certificado "${row.certificateName}" no encontrado, saltando`,
        );
        continue;
      }
      certificateId = cert.id;
    }
    const role = row.role ? (row.role.toUpperCase() as Role) : null;
    await prisma.certificateTemplate.upsert({
      where: { id: row.id || "non-existent-id" },
      update: { template: row.template, role },
      create: {
        id: row.id || undefined,
        certificateId,
        role,
        activityTypeId: row.activityTypeId || null,
        participantTypeId: row.participantTypeId || null,
        template: row.template.trim(),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedExams(wb: XLSX.WorkBook) {
  console.log("  → Exam...");
  interface Row {
    id: string;
    studentName: string;
    activityName: string;
    studentId: string;
    activityId: string;
    grade: number;
  }
  const rows = readSheet<Row>(wb, "Exam");
  for (const row of rows) {
    if (!row.grade) continue;
    let studentId = row.studentId;
    if (!studentId && row.studentName) {
      const student = await prisma.student.findFirst({
        where: { user: { name: row.studentName.trim() } },
      });
      if (!student) {
        console.warn(
          `     ⚠ Exam: estudiante "${row.studentName}" no encontrado, saltando`,
        );
        continue;
      }
      studentId = student.id;
    }
    let activityId = row.activityId;
    if (!activityId && row.activityName) {
      const activity = await prisma.activity.findFirst({
        where: { name: row.activityName.trim() },
      });
      if (!activity) {
        console.warn(
          `     ⚠ Exam: actividad "${row.activityName}" no encontrada, saltando`,
        );
        continue;
      }
      activityId = activity.id;
    }
    await prisma.exam.upsert({
      where: { studentId_activityId: { studentId, activityId } },
      update: { grade: Number(row.grade) },
      create: {
        id: row.id || crypto.randomUUID(),
        studentId,
        activityId,
        grade: Number(row.grade),
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

async function seedAcademicPeriods(wb: XLSX.WorkBook) {
  console.log("  → AcademicPeriod...");
  interface Row {
    id: string;
    name: string;
    startAt: unknown;
    endtAt: unknown; // typo intencional — así está en el Excel
    active: unknown;
    isCurrent: unknown;
    createdBy: string;
  }
  const rows = readSheet<Row>(wb, "AcademicPeriod");
  for (const row of rows) {
    if (!row.name) continue;
    const startDate = parseDate(row.startAt);
    const endDate = parseDate(row.endtAt);
    if (!startDate || !endDate) {
      console.warn(
        `     ⚠ AcademicPeriod "${row.name}": fechas inválidas, saltando`,
      );
      continue;
    }
    await prisma.academicPeriod.upsert({
      where: { name: row.name },
      update: {
        startDate,
        endDate,
        active: parseBoolean(row.active),
        isCurrent: parseBoolean(row.isCurrent),
      },
      create: {
        id: row.id || undefined,
        name: row.name.trim(),
        startDate,
        endDate,
        active: parseBoolean(row.active),
        isCurrent: parseBoolean(row.isCurrent),
        createdBy: row.createdBy || "seed",
      },
    });
  }
  console.log(`     ${rows.length} registros procesados`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Iniciando seed desde Excel...");
  console.log(`   Archivo: ${EXCEL_PATH}\n`);

  const wb = XLSX.readFile(EXCEL_PATH);

  try {
    await seedAcademicDegrees(wb);
    await seedAcademicTitles(wb);
    await seedUsers(wb); // Crea User + Account en transacción atómica
    await seedStudents(wb);
    await seedActivityTypes(wb);
    await seedActivities(wb);
    await seedParticipantTypes(wb);
    await seedParticipants(wb);
    await seedCertificates(wb);
    await seedCertificateTemplates(wb);
    await seedExams(wb);
    await seedAcademicPeriods(wb);

    console.log("\n✅ Seed completado exitosamente\n");
  } catch (error) {
    console.error("\n❌ Error durante el seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
