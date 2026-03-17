"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@/generated/prisma";
import { db } from "@/lib/db";
import { dbWithAutdit } from "@/lib/db/prisma";
import { withAudit } from "@/lib/with-audit";
import { Result } from "@/shared/core/Result";

export async function getActivityTypeById(id: string) {
  try {
    const data = await db.activityType.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participantTypes: true,
            activities: true,
            template: true,
          },
        },
        participantTypes: {
          select: {
            id: true,
            name: true,
            required: true,
            roles: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!data)
      return Result.fail("No se encontro el tipo de actividad").serialize();

    return Result.ok(data).serialize();
  } catch (error) {
    console.error(error);
    return Result.fail("Error al obtener el tipo de actividad").serialize();
  }
}

export type CreateParticipantTypeInput = {
  name: string;
  required: boolean;
  roles: Role[];
  activityTypeId: string;
};

export type UpdateParticipantTypeInput = {
  id: string;
  name: string;
  required: boolean;
  roles: Role[];
  activityTypeId: string;
};

async function createParticipantType(data: CreateParticipantTypeInput) {
  const participantType = await dbWithAutdit().participantType.create({
    data: {
      name: data.name,
      required: data.required,
      roles: data.roles,
      activityType: {
        connect: { id: data.activityTypeId },
      },
    },
    select: {
      id: true,
      name: true,
      required: true,
      roles: true,
      createdAt: true,
    },
  });

  revalidatePath(`/admin/activity-type/${data.activityTypeId}`);
  return Result.ok(participantType).serialize();
}

export async function auditedCreateParticipantType(
  data: CreateParticipantTypeInput,
) {
  return await withAudit(() => createParticipantType(data));
}

async function deleteParticipantType(id: string, activityTypeId: string) {
  await dbWithAutdit().participantType.delete({ where: { id } });
  revalidatePath(`/admin/activity-type/${activityTypeId}`);
  return Result.ok({ id }).serialize();
}

export async function auditedDeleteParticipantType(
  id: string,
  activityTypeId: string,
) {
  return await withAudit(() => deleteParticipantType(id, activityTypeId));
}

async function updateParticipantType(data: UpdateParticipantTypeInput) {
  const participantType = await dbWithAutdit().participantType.update({
    where: { id: data.id },
    data: {
      name: data.name,
      required: data.required,
      roles: data.roles,
    },
    select: {
      id: true,
      name: true,
      required: true,
      roles: true,
      createdAt: true,
    },
  });

  revalidatePath(`/admin/activity-type/${data.activityTypeId}`);
  return Result.ok(participantType).serialize();
}

export async function auditedUpdateParticipantType(
  data: UpdateParticipantTypeInput,
) {
  return await withAudit(() => updateParticipantType(data));
}

export async function auditedDeleteActivityType(id: string) {
  return await withAudit(() => deleteActivityType(id));
}

async function deleteActivityType(id: string) {
  // check relaciones de actividades, templates, si los participant types tienen relaciones activas
  const activityType = await db.activityType.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          activities: true,
          template: true,
          participantTypes: {
            where: {
              template: {
                some: {},
              },
            },
          },
        },
      },
    },
  });

  if (!activityType) {
    return Result.fail("No se encontro el tipo de actividad").serialize();
  }
  if (activityType._count.activities > 0) {
    return Result.fail("No se puede eliminar el tipo de actividad").serialize();
  }
  if (activityType._count.template > 0) {
    return Result.fail(
      "No se puede eliminar el tipo de actividad porque tiene un template asociado",
    ).serialize();
  }
  if (activityType._count.participantTypes > 0) {
    return Result.fail(
      "No se puede eliminar el tipo de actividad porque tiene participantantes asociados en uso",
    ).serialize();
  }
  const activityTypeDeleted = await dbWithAutdit().activityType.delete({
    where: { id },
    select: { name: true },
  });
  revalidatePath(`/admin/activity-type`);
  return Result.ok(activityTypeDeleted).serialize();
}
