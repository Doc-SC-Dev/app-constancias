import { type } from "arktype";

const participantSchema = type({
  id: type.string
    .atLeastLength(1)
    .configure({ message: "Debe seleccionar un usuario" }),
  type: "string",
  hours: type.number.atLeast(1).configure({
    message: "El participante debe tener como minimo 1 hora de participacion",
  }),
  required: "boolean",
})
  .array()
  .narrow((value, ctx) => {
    const allUnique =
      new Set<string>(value.map((v) => v.id)).size === value.length;

    if (!allUnique) {
      return ctx.reject({
        message: "No debes repetir participantes",
        code: "predicate",
      });
    }

    const allValid = value.every((v) => v.id.length > 0 && v.hours > 0);
    if (!allValid) {
      return ctx.reject({
        message: "Se deben completar todos los campos",
        code: "predicate",
      });
    }

    return true;
  });

export const activityCreateSchema = type({
  name: type.string.atLeastLength(3).configure({
    message: "Debe ingresar un nombre que tenga al menos 3 caracteres",
  }),
  date: type({ to: "Date | undefined ", from: "Date" }),
  type: type("string").narrow((value, ctx) =>
    value.length === 0
      ? ctx.reject({
          message: "Debes seleccionar un tipo de actividad",
          code: "predicate",
        })
      : true,
  ),
  participants: participantSchema,
}).narrow((value, ctx) => {
  if (!value.date.to) return true;
  if (value.date.to.getTime() <= value.date.from.getTime()) {
    return ctx.reject({
      message: "La fecha de fin debe ser mayor a la fecha de inicio",
      code: "predicate",
      path: ["date"],
    });
  }
  return true;
});

export type ActivityCreateDTO = typeof activityCreateSchema.infer;
