"use server";

import { revalidatePath } from "next/cache";
import { Gender, Prisma, type Role } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import type { AcademicDegreeCreateDto } from "@/lib/types/acadmic-grades";
import type { ActivityType } from "@/lib/types/activity";
import type {
  CertificatePaginated,
  ListParticipantType,
} from "@/lib/types/certificate";
import { PAGE_SIZE, type PaginationResponse } from "@/lib/types/pagination";
import { withAudit } from "@/lib/with-audit";
import { Result } from "@/shared/core/Result";
import type { AcademicDegreeDto } from "./_components/config-grades";
import type { CreateActivityType } from "./_components/form/create-activity-type-form";

export const getPaginatedAcademicDegree = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<AcademicDegreeDto>> => {
  const [count, degrees] = await db.$transaction([
    db.academicDegree.count(),
    db.academicDegree.findMany({
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
      include: {
        title: {
          select: {
            gender: true,
            abbrev: true,
          },
        },
      },
    }),
  ]);

  const data = degrees.map<AcademicDegreeDto>((degree) => ({
    ...degree,
    abbrevFem:
      degree.title.filter((t) => t.gender === Gender.FEMALE)?.at(0)?.abbrev ??
      "",
    abbrevMas:
      degree.title.filter((t) => t.gender === Gender.MALE)?.at(0)?.abbrev ?? "",
  }));
  return { data, nextPage: pageParam + 1, totalRows: count };
};

const createAcademicDegree = async ({
  name,
  abbrevFem,
  abbrevMas,
}: AcademicDegreeCreateDto): Promise<
  ReturnType<Result<AcademicDegreeDto, string>["serialize"]>
> => {
  const degree = await dbWithAutdit().academicDegree.create({
    data: {
      name,
      title: {
        create: [
          {
            gender: Gender.FEMALE,
            abbrev: abbrevFem,
          },
          {
            gender: Gender.MALE,
            abbrev: abbrevMas,
          },
        ],
      },
    },
  });
  const serializeData = Result.ok<AcademicDegreeDto, string>({
    ...degree,
    abbrevFem,
    abbrevMas,
  }).serialize();
  return serializeData;
};

export const updateAcademicPeriods = async (
  periods: { startDate: Date; endDate: Date }[],
) => {
  const { user } = await isAuthenticated();
  if (!isAdmin(user.role as Role)) {
    return { success: false, message: "No autorizado" };
  }

  await db.academicPeriod.updateMany({
    where: { active: true },
    data: { active: false },
  });

  for (let i = 0; i < periods.length; i++) {
    const periodData = periods[i];
    const year = periodData.startDate.getFullYear();
    const semester = i === 0 ? 1 : 2;
    const name = `${year}-${semester}`;

    const existing = await db.academicPeriod.findUnique({ where: { name } });
    if (existing) {
      await db.academicPeriod.update({
        where: { id: existing.id },
        data: {
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          active: false,
        },
      });
    } else {
      await db.academicPeriod.create({
        data: {
          name,
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          active: false,
          createdBy: user.id,
        },
      });
    }
  }

  const currentDate = new Date();
  const newActivePeriod = await db.academicPeriod.findFirst({
    where: {
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
  });

  if (newActivePeriod) {
    await db.academicPeriod.update({
      where: { id: newActivePeriod.id },
      data: { active: true },
    });
  }

  revalidatePath("/admin");
  return { success: true, message: "Periodos actualizados exitosamente" };
};

export async function auditedCreateAcadmicDegree(
  data: AcademicDegreeCreateDto,
) {
  return await withAudit(() => createAcademicDegree(data));
}

export const getNonDirectorUsers = async () => {
  const users = await db.user.findMany({
    where: {
      isDirector: false,
      banned: false,
      role: {
        notIn: ["SUPERADMIN", "STUDENT"],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return users;
};

export const changeDirectorAction = async ({
  userId,
  oldDirector,
}: {
  userId: string;
  oldDirector: string;
}): Promise<ReturnType<Result<{ name: string }, string>["serialize"]>> => {
  try {
    const newDirector = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: oldDirector,
        },
        data: {
          isDirector: false,
        },
      });
      const newDirector = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          isDirector: true,
        },
        select: {
          name: true,
        },
      });
      return newDirector;
    });
    revalidatePath("/admin?tab=general");
    return Result.ok(newDirector).serialize();
  } catch (_) {
    return Result.fail("Error interno cambiando el director.").serialize();
  }
};

export const getActivityTypesPaginated = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<ActivityType>> => {
  const [count, activityTypes] = await db.$transaction([
    db.activityType.count(),
    db.activityType.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
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
    }),
  ]);
  return {
    data: activityTypes.map<ActivityType>((activityType) => ({
      ...activityType,
      nParticipantsTypes: activityType._count.participantTypes,
    })),
    nextPage: pageParam + 1,
    totalRows: count,
  };
};

async function createActivityType(
  data: CreateActivityType,
): Promise<ReturnType<Result<ActivityType, string>["serialize"]>> {
  const participanTypes = data.participantTypes.map((pt) =>
    Prisma.validator<Prisma.ParticipantTypeCreateInput>()({
      name: pt.name,
      required: pt.required,
    }),
  );
  const activityTypeInput = Prisma.validator<Prisma.ActivityTypeCreateInput>()({
    name: data.name,
    participantTypes: {
      createMany: {
        data: participanTypes,
      },
    },
  });

  const result = await dbWithAutdit().activityType.create({
    data: activityTypeInput,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return Result.ok<ActivityType, string>({
    ...result,
    nParticipantsTypes: participanTypes.length,
  }).serialize();
}

export async function auditedCreateActivityType(data: CreateActivityType) {
  return await withAudit(() => createActivityType(data));
}

export async function getPaginatedCertificates({
  pageParam,
}: {
  pageParam: number;
}): Promise<PaginationResponse<CertificatePaginated>> {
  const [count, certificates] = await db.$transaction([
    db.certificate.count(),
    db.certificate.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            template: true,
          },
        },
        createdAt: true,
      },
      take: PAGE_SIZE,
      skip: PAGE_SIZE * pageParam,
    }),
  ]);

  return {
    data: certificates.map<CertificatePaginated>((cert) => ({
      ...cert,
      templates: cert._count.template,
    })),
    totalRows: count,
    nextPage: pageParam + 1,
  };
}

export async function getParticipantTypes(
  id: string[],
): Promise<ListParticipantType[]> {
  if (!id.length) return [];
  const participantTypes = await db.participantType.findMany({
    where: {
      activityTypeId: {
        in: Array.from(new Set(id)),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return participantTypes;
}
