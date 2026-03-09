"use server";

import { ArkErrors } from "arktype";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import type { CertificateCreateDto } from "@/lib/types/certificate";
import { certificateCreateSchema } from "@/lib/types/certificate";
import { Result } from "@/shared/core/Result";

export async function createCertificateAction(data: CertificateCreateDto) {
  const validationResult = certificateCreateSchema(data);
  if (validationResult instanceof ArkErrors) {
    return Result.fail("Datos de formulario inválidos").serialize();
  }

  const templatesToCreate: Prisma.CertificateTemplateCreateWithoutCertificateInput[] =
    [];
  switch (validationResult.templateLocation) {
    case "role":
      validationResult.roles.forEach((role) => {
        templatesToCreate.push({
          role: role.name,
          template: role.template,
        });
      });
      break;
    case "activity":
      validationResult.activityTypes.forEach((activityType) => {
        templatesToCreate.push({
          activityType: {
            connect: {
              id: activityType.id,
            },
          },
          template: activityType.template,
        });
      });
      break;
    case "participant":
      validationResult.participantTypes.forEach((participantType) => {
        templatesToCreate.push({
          participantType: {
            connect: {
              id: participantType.id,
            },
          },
          template: participantType.template,
        });
      });
      break;
    default:
      break;
  }

  try {
    const certificate = await db.certificate.create({
      data: {
        name: validationResult.name,
        template: {
          create: templatesToCreate,
        },
      },
    });
    // revalidatePath("/admin/certificate");
    revalidatePath("/admin?tab=certificates");
    return Result.ok(certificate).serialize();
  } catch (e) {
    console.error(e);
    return Result.fail("Error interno creando el certificado.").serialize();
  }
}
