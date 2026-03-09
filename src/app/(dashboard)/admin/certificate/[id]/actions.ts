"use server";

import { $Enums, Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import type { Certificate } from "@/lib/types/certificate";
import { Result, type SerializedResult } from "@/shared/core/Result";

export const findCertificateById = async (
  id: string,
): Promise<SerializedResult<Certificate, string>> => {
  const selectFullCertificate = Prisma.validator<Prisma.CertificateSelect>()({
    id: true,
    name: true,
    template: {
      select: {
        role: true,
        template: true,
        id: true,
        activityType: {
          select: {
            id: true,
            name: true,
          },
        },
        participantType: {
          select: {
            id: true,
            name: true,
            activityType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
    createdAt: true,
  });

  const certificate = await db.certificate.findUnique({
    where: { id },
    select: selectFullCertificate,
  });
  if (!certificate)
    return Result.fail(
      `No se ha encontrado el certificado con id ${id}`,
    ).serialize();

  if (certificate.template.at(0)?.role) {
    return Result.ok({
      ...certificate,
      variant: "role",
      template: certificate.template.map((temp) => ({
        id: temp.id,
        role: temp.role ?? $Enums.Role.STUDENT,
        template: temp.template,
      })),
    } satisfies Certificate).serialize();
  } else if (certificate.template.at(0)?.activityType) {
    return Result.ok({
      id: certificate.id,
      name: certificate.name,
      createdAt: certificate.createdAt,
      variant: "activity",
      template: certificate.template.map((temp) => ({
        id: temp.id,
        activityType: temp.activityType ?? { id: "", name: "" },
        template: temp.template,
      })),
    } satisfies Certificate).serialize();
  }

  return Result.ok({
    id: certificate.id,
    name: certificate.name,
    createdAt: certificate.createdAt,
    variant: "participant",
    template: certificate.template.map((temp) => ({
      id: temp.id,
      template: temp.template,
      participantType: {
        id: temp.participantType?.id as string,
        name: temp.participantType?.name as string,
        activityType: temp.participantType?.activityType as {
          id: string;
          name: string;
        },
      },
    })),
  } satisfies Certificate).serialize();
};
