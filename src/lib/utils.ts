import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Textos = {
  Role: {
    [Role.ADMINISTRATOR]: "Administrador",
    [Role.PROFESSOR]: "Profesor",
    [Role.STUDENT]: "Estudiante",
    [Role.SUPERADMIN]: "Super Administrador",
    administrator: "Administrador",
    professor: "Profesor",
    student: "Estudiante",
    superadmin: "Super Administrador",
  } as Record<string, string>,

  Gender: {
    MALE: "Masculino",
    FEMALE: "Femenino",
    OTHER: "Otro",
  } as Record<string, string>,

  AcademicGrade: {
    DOCTOR: "Doctor",
    DOCTORA: "Doctora",
    MAGISTER: "Magíster",
  } as Record<string, string>,

  State: {
    PENDING: "En proceso",
    REJECTED: "Rechazada",
    APPROVED: "Aprobada",
    CANCELED: "Rechazada",
    READY: "Aprobada",
  } as Record<string, string>,
};

export function formatDate(date: Date) {
  return date.toLocaleDateString("es-CL").replaceAll("-", "/");
}

export function formatTitle(title: string) {
  const withoutUnserscore = title.replaceAll("_", " ");
  return (
    withoutUnserscore[0].toLocaleUpperCase() +
    withoutUnserscore.slice(1).toLocaleLowerCase()
  );
}

export function parseAcademicPeriodName(name: string): {
  year: number;
  semester: number;
} {
  const parts = name.split("-");
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10);
    const semester = parseInt(parts[1], 10);
    return { year, semester };
  }

  const yearMatch = name.match(/\d{4}/);
  const year = yearMatch
    ? parseInt(yearMatch[0], 10)
    : new Date().getFullYear();

  const semesterMatch = name.match(/[12]$/);
  const semester = semesterMatch ? parseInt(semesterMatch[0], 10) : 1;

  return { year, semester };
}

export function generateAcademicPeriodName(
  year: number,
  semester: 1 | 2,
): string {
  return `${year}-${semester}`;
}
