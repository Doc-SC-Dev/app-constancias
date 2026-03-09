import { type } from "arktype";
import type { $Enums } from "@/generated/prisma";

export const certificateCreateSchema = type({
  name: type("string")
    .moreThanLength(2)
    .configure({ message: "Debe tener mas de dos caracteres" }),
}).and(
  type({
    templateLocation: "'role'",
    roles: type({
      name: type("'PROFESSOR' | 'STUDENT'"),
      template: type("string").moreThanLength(0),
    })
      .array()
      .atLeastLength(1)
      .configure({ message: "Tienes que seleccionar por lo menos un rol" })
      .atMostLength(2)
      .configure({ message: "No puedes seleccionar mas de 2 roles" }),
  })
    .or({
      templateLocation: "'activity'",
      activityTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
        template: type("string").moreThanLength(0),
      })
        .array()
        .atLeastLength(1),
    })
    .or({
      templateLocation: "'participant'",
      activityTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
      })
        .array()
        .atLeastLength(1),
      participantTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
        template: type("string").moreThanLength(0),
      })
        .array()
        .moreThanLength(0),
    }),
);
export type CertificateCreateDto = typeof certificateCreateSchema.infer;

export type CertificatePaginated = {
  id: string;
  name: string;
  createdAt: Date;
  templates: number;
};

export type Certificate = {
  id: string;
  name: string;
  createdAt: Date;
} & (
  | {
      variant: "role";
      template: {
        id: string;
        role: $Enums.Role;
        template: string;
      }[];
    }
  | {
      variant: "activity";
      template: {
        id: string;
        activityType: {
          id: string;
          name: string;
        };
        template: string;
      }[];
    }
  | {
      variant: "participant";
      template: {
        template: string;
        id: string;
        participantType: {
          id: string;
          name: string;
          activityType: {
            id: string;
            name: string;
          };
        };
      }[];
    }
);

export type ListParticipantType = {
  id: string;
  name: string;
};

export const certificateEditSchema = type({
  id: type("string")
    .moreThanLength(0)
    .configure({ message: "Debes ingresar un id" }),
  name: type("string")
    .moreThanLength(2)
    .configure({ message: "Debe tener mas de dos caracteres" }),
}).and(
  type({
    templateLocation: "'role'",
    roles: type({
      name: type("'PROFESSOR' | 'STUDENT'"),
      template: type("string").moreThanLength(0),
      templateId: type("string")
        .moreThanLength(0)
        .configure("El id del template es obligatorio"),
    })
      .array()
      .atLeastLength(1)
      .configure({ message: "Tienes que seleccionar por lo menos un rol" })
      .atMostLength(2)
      .configure({ message: "No puedes seleccionar mas de 2 roles" }),
  })
    .or({
      templateLocation: "'activity'",
      activityTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
        template: type("string").moreThanLength(0),
        templateId: type("string")
          .moreThanLength(0)
          .configure("El id del template es obligatorio"),
      })
        .array()
        .atLeastLength(1),
    })
    .or({
      templateLocation: "'participant'",
      activityTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
      })
        .array()
        .atLeastLength(1),
      participantTypes: type({
        id: type("string").moreThanLength(0),
        name: type("string").moreThanLength(0),
        template: type("string").moreThanLength(0),
        templateId: type("string")
          .moreThanLength(0)
          .configure("El id del template es obligatorio"),
      })
        .array()
        .moreThanLength(0),
    }),
);

export type CertificateEditDto = typeof certificateEditSchema.infer;
