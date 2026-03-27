"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateCertificateAction } from "@/features/requests/actions/generate-certificate.action";
import { Role } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { getOrUpdateActivePeriod } from "@/lib/period";
import type { ActivityType } from "@/lib/types/activity";
import { Certificates } from "@/lib/types/request";
import { Result } from "@/shared/core/Result";
import { withTryCatch } from "../action";

export const logoutAction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export const getAcademicDegree = async () => {
  const degree = await db.academicDegree.findMany({
    include: {
      title: {
        select: {
          gender: true,
          abbrev: true,
        },
      },
    },
  });

  return degree;
};

export const createRequest = async (data: {
  certificateName: string;
  activityId: string | undefined;
  userId: string;
  description?: string;
}) => {
  const { user } = await isAuthenticated();

  if (!isAdmin(user.role as Role)) {
    const activePeriod = await getOrUpdateActivePeriod();
    if (!activePeriod) {
      return {
        success: false,
        message:
          "En este momento la plataforma se encuentra inactiva, no es posible ingresar solicitudes",
      };
    }
  }

  const isStandard = data.certificateName !== Certificates.OTHER;
  // TODO: corrigir error de tipo hay corregir el tipo para que acepte el title
  const {
    success,
    error,
    data: request,
  } = await withTryCatch<{ id: string }>(
    db.request.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        activity: data.activityId
          ? {
              connect: {
                id: data.activityId,
              },
            }
          : {},
        certificate: {
          connect: {
            name: data.certificateName,
          },
        },
        otherRequest: !isStandard
          ? {
              create: {
                name: data.certificateName,
                description: data.description ?? "",
                userId: data.userId,
              },
            }
          : undefined,
        state: !isStandard ? "PENDING" : "READY",
      },
      select: { id: true },
    }),
  );

  if (!success)
    return {
      success: false,
      message:
        error ===
        "Se ha producido un error inesperado. Por favor, intente nuevamente."
          ? "Se deben completar todos los campos"
          : error,
    };

  if (isStandard) {
    const pdf = await generateCertificateAction({
      requestId: request.id,
      user,
    });
    revalidatePath("/dashboard/history");
    return {
      success: true,
      message: `La solicitud ha sido registrada correctamente.`,
      data: pdf,
    };
  }
  revalidatePath("/dashboard/history");
  return {
    success: true,
    message: `Solicitud creada exitosamente con id ${request.id}`,
    data: null,
  };
};

export const downloadCertificate = async (requestId: string) => {
  const { user } = await isAuthenticated();
  const data = await generateCertificateAction({ requestId, user });

  if (data.isSuccess) return Result.ok(data.value).serialize();
  return Result.fail(data.error.message).serialize();
};

export const getNotAdminUsers = async () => {
  const user = await db.user.findMany({
    where: {
      role: {
        notIn: [Role.ADMINISTRATOR, Role.SUPERADMIN],
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
  if (user.length === 0) {
    return Result.fail("No se han encontrado usuarios").serialize();
  }

  return Result.ok(user).serialize();
};

export const getActivityTypes = async (): Promise<ActivityType[]> => {
  const activityTypes = await db.activityType.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          participantTypes: true,
        },
      },
    },
  });

  return activityTypes.map<ActivityType>((activityType) => ({
    ...activityType,
    nParticipantsTypes: activityType._count.participantTypes,
  }));
};

export async function getAvailableCertificates({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    return Result.fail("Usuario no encontrado").serialize();
  }

  const certificates = await db.certificate.findMany({
    where: {
      template: {
        some: {
          OR: [
            {
              role: user.role,
            },
            {
              activityType: {
                activities: {
                  some: {
                    participants: {
                      some: {
                        userId: userId,
                      },
                    },
                  },
                },
              },
            },
            {
              participantType: {
                participants: {
                  some: {
                    userId: userId,
                  },
                },
              },
            },
          ],
        },
      },
    },
    select: {
      name: true,
      id: true,
    },
  });

  return Result.ok(certificates).serialize();
}

export async function getAvailableActivities({
  certificateName,
}: {
  certificateName: string;
}) {
  const activities = await db.activity.findMany({
    where: {
      activityType: {
        OR: [
          {
            template: {
              some: {
                certificate: {
                  name: certificateName,
                },
              },
            },
          },
          {
            participantTypes: {
              some: {
                template: {
                  some: {
                    certificate: {
                      name: certificateName,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
    select: {
      name: true,
      id: true,
    },
  });

  return Result.ok(activities).serialize();
}
