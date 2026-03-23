import { type } from "arktype";

export const CreateAcademicDegreeSchema = type({
  name: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "El nombre es requerido",
    }),
  abbrevFem: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "La abreviatura femenina es requerida",
    })
    .pipe((val) => (val.at(-1) === "." ? val : `${val}.`)),
  abbrevMas: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "La abreviatura masculina es requerida",
    })
    .pipe((val) => (val.at(-1) === "." ? val : `${val}.`)),
});

export const UpdateAcademicDegreeSchema = type({
  id: type("string"),
  name: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "El nombre es requerido",
    }),
  abbrevFem: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "La abreviatura femenina es requerida",
    })
    .pipe((val) => (val.at(-1) === "." ? val : `${val}.`)),
  abbrevMas: type("string")
    .moreThanLength(1)
    .configure({
      message: () => "La abreviatura masculina es requerida",
    })
    .pipe((val) => (val.at(-1) === "." ? val : `${val}.`)),
  abbrevFemId: type("string"),
  abbrevMasId: type("string"),
});
