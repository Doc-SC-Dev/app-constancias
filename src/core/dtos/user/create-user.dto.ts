import { type } from "arktype";
import { Roles } from "@/lib/authorization/permissions";

const genderSchema = type('"FEMALE"| "MALE"| "OTHER"');

export type Gender = typeof genderSchema.infer;

const roleSchema = type.enumerated(...Object.values(Roles));

const rutSchema = type("string").narrow((s, ctx) => {
  if (!/^[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9k]{1}$/.test(s)) {
    return ctx.reject({
      code: "predicate",
      message: "El RUT debe tener puntos y guion",
    });
  }
  return true;
});

export const userCreateSchema = type({
  name: type.string
    .atLeastLength(1)
    .configure({ message: "Nombre es un campo requerido" }),
  rut: rutSchema,
  email: type("string.email").configure({
    message: "El correo ingresado ser un correo valido",
  }),
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
      message: "La matricula es requerida",
      path: ["studentId"],
    });
  }

  return true;
});

export type UserCreateDto = typeof userCreateSchema.infer;
