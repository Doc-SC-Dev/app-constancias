import { type } from "arktype";
import type { UserWithRole } from "better-auth/plugins";
import { Gender, Role } from "@/generated/prisma";
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

export type UserWithAcademicDegree = User & {
  academicDegree: {
    name: string;
  };
};

const rutSchema = type("string").narrow((s, ctx) => {
  if (!/^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9k]{1}$/.test(s)) {
    return ctx.reject({
      code: "predicate",
      message: "El RUT debe tener puntos y guion",
    });
  }
  return true;
});

const roleSchema = type.enumerated(...Object.values(Role));

export const userEditSchema = type({
  id: "string",
  name: type("string >= 1").configure({
    message: "El nombre es un campo requerido, no puede estar vacío.",
  }),
  rut: rutSchema,
  email: type("string.email").configure({
    message: "Ingrese un email valido.",
  }),
  role: roleSchema,
});

export type UserEdit = typeof userEditSchema.infer;

const genderSchema = type.enumerated(...Object.values(Gender));

export type GenderType = typeof genderSchema.infer;

const nameSchema = type("string").narrow((s, ctx) => {
  if (s.length < 2) {
    return ctx.reject({
      code: "predicate",
      message: "El nombre debe tener al menos 2 caracteres",
    });
  }
  return true;
});

const emailSchema = type("string.email").configure({
  message: "Debe ingresar un email valido",
});

export const userCreateSchema = type({
  name: nameSchema,
  rut: rutSchema,
  email: emailSchema,
  role: roleSchema,
  gender: genderSchema,
  "studentId?": type("string.numeric").narrow((value, ctx) => {
    if (value !== undefined && Number.isNaN(value)) {
      console.log(value);
      return ctx.reject({
        code: "predicate",
        message: "Matricula debe ser una cadena numerica bien formada",
      });
    }
    return true;
  }),
  "admissionDate?": "Date",
  academicGrade: type("string > 1").configure({
    message: "El grado academico es un campo requerido",
  }),
}).narrow((val, ctx) => {
  if (val.role === Roles.STUDENT && val.admissionDate === undefined) {
    return ctx.reject({
      code: "predicate",
      message: "La fecha de ingreso es requerida",
      path: ["admissionDate"],
    });
  }

  if (val.role === Roles.STUDENT && val.studentId === undefined) {
    return ctx.reject({
      code: "predicate",
      message: "La matrícula es requerida",
      path: ["studentId"],
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

export type UserRequestDTO = {
  name: string;
  createdAt: Date;
  state: string;
};
