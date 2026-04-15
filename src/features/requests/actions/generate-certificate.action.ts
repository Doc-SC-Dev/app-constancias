"use server";

import { ArkErrors } from "arktype";
import { isAdmin, type Role } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import type { GenderType } from "@/lib/types/users";
import { formatDate } from "@/lib/utils";
import { Result, type SerializedResult } from "@/shared/core/Result";
import { GenerateCertificateSchema } from "../schemas/generate-certificate.schema";
import { AppError } from "../services/app-error";
import { generatePdf } from "../services/certificate-pdf.service";
import {
  renderTemplate,
  selectTemplate,
} from "../services/certificate-renderer.service";
import type { FullRequest } from "../types/request.types";

export async function generateCertificateAction(
  raw: unknown,
): Promise<
  SerializedResult<{ pdfBase64: string; fileName: string }, AppError>
> {
  // 1. Validate input via arktype
  const data = GenerateCertificateSchema(raw);
  if (data instanceof ArkErrors) {
    return Result.fail(
      AppError.validation(`Input inválido: ${data.summary}`),
    ).serialize();
  }

  // 2. Authorize caller
  const { user: sessionUser } = data;

  // 3. Fetch FullRequest eager-loading ALL required relations
  const request = await db.request.findUnique({
    where: { id: data.requestId },
    include: {
      user: {
        include: {
          academicDegree: {
            include: {
              title: { where: { gender: sessionUser.gender as GenderType } },
            },
          },
          student: true,
        },
      },
      certificate: {
        include: { template: true },
      },
      activity: {
        include: {
          activityType: true,
          participants: {
            include: {
              user: true,
              type: true,
            },
          },
        },
      },
      otherRequest: true,
    },
  });

  if (!request) {
    return Result.fail(AppError.notFound("Request not found")).serialize();
  }

  // Check Permissions: Owners, Admins or Super Admins
  if (request.userId !== sessionUser.id && !isAdmin(sessionUser.role as Role)) {
    return Result.fail(
      AppError.forbidden("No tienes permiso para generar este certificado."),
    ).serialize();
  }

  // 4. Idempotency Check
  let renderedBody = request.generatedContent;

  if (!renderedBody) {
    // 5. Fetch Director programmatically (separate from main object)
    const directorUser = await db.user.findFirst({
      where: { isDirector: true },
      select: {
        name: true,
        academicDegree: { select: { title: true } },
        gender: true,
      },
    });
    if (!directorUser)
      return Result.fail(
        AppError.notFound("Director del programa no encontrado"),
      ).serialize();

    const fullRequest = {
      ...request,
      user: {
        ...request.user,
        student: request.user.student
          ? {
              participants: request.activity?.participants
                .filter((part) => part.user.id === request.user.id)
                .map((part) => ({ type: { name: part.type.name } })),
              ...request.user.student,
              admisionYear: request.user.student.admisionDate.getFullYear(),
            }
          : null,
      },
      activity: request.activity
        ? {
            ...request.activity,
            startAt: formatDate(request.activity.startAt),
            endAt: request.activity.endAt
              ? formatDate(request.activity.endAt)
              : null,
          }
        : null,
      director: directorUser,
    } as FullRequest;
    // 6. Template Selection logic matches roles/participant/activities exclusivity
    const template = selectTemplate(request.certificate.template, fullRequest);
    if (!template) {
      return Result.fail(
        AppError.notFound("Plantilla no encontrada"),
      ).serialize();
    }

    // 7. Render Template completely outside of the web view coupling
    renderedBody = renderTemplate(template.template, fullRequest);

    // 8. Atomic db transaction guarantees we don't save half-changed states
    await db.$transaction([
      db.request.update({
        where: { id: data.requestId },
        data: { generatedContent: renderedBody, state: "READY" },
      }),
      db.log.create({
        data: {
          action: "GENERATE_CERTIFICATE",
          resource: "Request",
          resourceId: data.requestId,
          userName: sessionUser.name,
          userId: sessionUser.id,
          oldValue: JSON.parse(JSON.stringify({ state: request.state })),
          newValue: JSON.parse(JSON.stringify({ state: "READY" })),
        },
      }),
    ]);
  }

  // 9. Generate PDF
  const pdfResult = await generatePdf(renderedBody);

  if (!pdfResult.isSuccess) {
    return Result.fail(pdfResult.error).serialize();
  }

  // Expose as Base64 format exclusively allowing straightforward browser attachment downloads
  return Result.ok({
    pdfBase64: pdfResult.value,
    fileName: `${request.certificate.name.replace(/\s+/g, "_")}.pdf`,
  }).serialize();
}
