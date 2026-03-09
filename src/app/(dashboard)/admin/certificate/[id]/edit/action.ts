"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import type { CertificateEditDto } from "@/lib/types/certificate";
import { Result } from "@/shared/core/Result";

export async function updateCertificateAction(data: CertificateEditDto) {
  const templates: Prisma.CertificateTemplateUpdateManyWithWhereWithoutCertificateInput[] =
    [];

  if (data.templateLocation === "activity") {
    data.activityTypes.forEach((val) => {
      templates.push({
        where: { id: val.templateId },
        data: { template: val.template, activityTypeId: val.id },
      });
    });
  }
  if (data.templateLocation === "participant") {
    data.participantTypes.forEach((val) => {
      templates.push({
        where: { id: val.templateId },
        data: { template: val.template, participantTypeId: val.id },
      });
    });
  }

  if (data.templateLocation === "role") {
    data.roles.forEach((val) => {
      templates.push({
        where: { id: val.templateId },
        data: { role: val.name, template: val.template },
      });
    });
  }

  try {
    const response = await db.certificate.update({
      where: { id: data.id },
      data: {
        name: data.name,
        template: {
          updateMany: templates,
        },
      },
    });
    revalidatePath(`/admin/certificate/${response.id}`);
    return Result.ok({ name: response.name, id: response.id }).serialize();
  } catch (_) {
    return Result.fail(
      `Ha ocurrido un error al actualizar el certificado con nombre ${data.name}`,
    );
  }
}
