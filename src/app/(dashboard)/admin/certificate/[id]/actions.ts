"use server";

import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import type { Certificate } from "@/lib/types/certificate";

export const findCertificateById = async (
  id: string,
): Promise<
  | {
      isSuccess: true;
      value: Certificate;
      error?: undefined;
    }
  | { isSuccess: false; error: string; value?: undefined }
> => {
  const selectFullCertificate = Prisma.validator<Prisma.CertificateSelect>()({
    id: true,
    name: true,
    template: true,
    createdAt: true,
    roles: true,
    activityTypes: {
      select: {
        name: true,
        id: true,
      },
    },
    participantTypes: {
      select: {
        name: true,
        id: true,
      },
    },
  });

  const certificate = await db.certificate.findUnique({
    where: { id },
    select: selectFullCertificate,
  });
  if (!certificate)
    return { isSuccess: false, error: "No se encontro el certificado" };
  return {
    isSuccess: true,
    value: {
      ...certificate,
      participantType: certificate.participantTypes,
      activityType: certificate.activityTypes,
    } satisfies Certificate,
  };
};
