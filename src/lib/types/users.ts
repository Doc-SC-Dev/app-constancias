import { type } from "arktype";
import type { UserWithRole } from "better-auth/plugins";
import type { auth } from "../auth";

export type User = UserWithRole;
export type Session = typeof auth.$Infer.Session;
export type UserWithRut = typeof auth.$Infer.Session.user;

const roles = type(
  "'administrator' | 'professor' | 'student' | 'superadmin'| 'guest'",
);

export const userEditSchema = type({
  name: "string >= 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: roles,
});

export type UserEdit = typeof userEditSchema.infer;

export const userCreateSchema = type({
  name: "string > 1",
  rut: /^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9]{1}$/,
  email: "string.email",
  role: roles,
  "studentId?": "string.numeric",
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
