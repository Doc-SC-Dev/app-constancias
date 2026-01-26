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
