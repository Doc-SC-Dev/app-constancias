import { type } from "arktype";
import type { UserWithRole } from "better-auth/plugins";
import { AcademicGrade, Genre } from "@/generated/prisma";
import type { auth } from "../auth";
import { Roles } from "../authorization/permissions";

export type UserSelect = UserWithRole;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export type UserWithActivities = User & {
  participants: {
    activity: {
      name: string;
      activityType: string;
    };
    hours: number;
    type: string;
  }[];
};

const rolSchema = type.enumerated(...Object.values(Roles));
export const userEditSchema = type({
  name: "string >= 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: rolSchema,
});

export type UserEdit = typeof userEditSchema.infer;

const academicGrade = type.enumerated(...Object.values(AcademicGrade));

const genderSchema = type.enumerated(...Object.values(Genre));

export type Gender = typeof genderSchema.infer;

export const userCreateSchema = type({
  name: "string > 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: rolSchema,
  gender: genderSchema,
  "studentId?": "string.numeric",
  "admissionDate?": "Date",
  "academicGrade?": academicGrade,
}).narrow((val, ctx) => {
  if (val.role === "student" && !val.admissionDate) {
    return ctx.reject({
      code: "predicate",
      message: "La fecha de ingreso es requerida",
      path: ["admissionDate"],
    });
  }
  if (val.role === "student" && !val.studentId) {
    return ctx.reject({
      code: "predicate",
      message: "La matricula es requerida",
      path: ["studentId"],
    });
  }
  if (val.role !== "student" && !val.academicGrade) {
    return ctx.reject({
      code: "predicate",
      message: "El grado académico es requerido",
      path: ["academicGrade"],
    });
  }
  return true;
});

export type UserCreate = typeof userCreateSchema.infer;

const requirements = [
  { check: (s: string) => s.length >= 8, label: "Mínimo 8 caracteres" },
  {
    check: (s: string) => /[a-z]/.test(s),
    label: "Al menos una letra minúscula",
  },
  {
    check: (s: string) => /[A-Z]/.test(s),
    label: "Al menos una letra mayúscula",
  },
  { check: (s: string) => /\d/.test(s), label: "Al menos un número" },
  {
    check: (s: string) => /[\W_]/.test(s),
    label: "Al menos un carácter especial (!@#...)",
  },
];

// 2. Creamos el tipo personalizado con .narrow()
export const passwordScema = type("string").narrow((val, ctx) => {
  // Filtramos los requisitos que NO se cumplen
  const missing = requirements.filter((req) => !req.check(val));

  if (missing.length > 0) {
    // Si hay fallos, creamos un mensaje formateado
    const message = `${missing.map((req) => `${req.label}\n`)}`;

    // Rechazamos la validación inyectando nuestro mensaje personalizado
    return ctx.reject({
      code: "predicate", // Tipo de error genérico para validaciones custom
      message: message,
    });
  }

  return true; // Validación exitosa
});

export const newPasswordSchema = type({
  currentPass: "string",
  newPass: passwordScema,
  confirPass: "string",
}).narrow((data, ctx) => {
  if (data.currentPass === data.newPass) {
    return ctx.reject({
      code: "predicate",
      message: "La nueva contraseña no puede ser igual a la contraseña actual",
      path: ["newPass"],
    });
  }
  if (data.newPass !== data.confirPass) {
    return ctx.reject({
      code: "predicate",
      message: "Las contraseñas ingresadas no coinciden",
      path: ["confirPass"],
    });
  }
  return true;
});

export type NewPassword = typeof newPasswordSchema.infer;

export const resetPasswordSchema = type({
  newPass: passwordScema,
  confirPass: "string",
}).narrow((data, ctx) => {
  if (data.newPass !== data.confirPass) {
    return ctx.reject({
      code: "predicate",
      message: "Las contraseñas ingresadas no coinciden",
      path: ["confirPass"],
    });
  }
  return true;
});

export type ResetPassword = typeof resetPasswordSchema.infer;
