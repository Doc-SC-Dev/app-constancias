import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { ActivityCreateDTO } from "@/core/dtos/activity/create-activity.dto";
import type { ActivityEntity } from "@/core/entities/activity.entity";
import type { ActivityError } from "@/core/errors/activity-error";
import type { IActivityRepository } from "@/core/interfaces/repositories/activity-respository.interface";
import { ActivityMapper, activityPayload } from "@/data/mapper/activity.mapper";
import { Prisma } from "@/generated/prisma";
import { db, dbWithAutdit } from "@/lib/db/prisma";
import { Result } from "@/shared/core/Result";

export class PrismaActivityRespository implements IActivityRepository {
  async create(
    activity: ActivityCreateDTO,
  ): Promise<Result<ActivityEntity, ActivityError>> {
    const activityBody = Prisma.validator<Prisma.ActivityCreateInput>()({
      ...activity,
      startAt: activity.date.from,
      endAt: activity.date.to,
      nParticipants: activity.participants.length,
      activityType: { connect: { id: activity.type } },
      participants: {
        createMany: {
          data: activity.participants.map((p) => ({
            userId: p.id,
            hours: p.hours,
            participantTypeId: p.type,
          })),
        },
      },
    });
    const activitySelect = Prisma.validator<Prisma.ActivitySelect>()(
      activityPayload.select,
    );
    try {
      const result: Prisma.ActivityGetPayload<typeof activityPayload> =
        await dbWithAutdit().activity.create({
          data: activityBody,
          select: activitySelect,
        });
      const domainActivity = ActivityMapper.toDomain(result);
      return Result.ok(domainActivity);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === "P2006")
          return Result.fail({
            type: "BAD_REQUEST",
            message: `Valor para ${error.meta?.taget} no es valido`,
          });
      return Result.fail({
        type: "DATABASE_ERROR",
        message: "Error interno del servidor",
      });
    }
  }
  async findById(id: string): Promise<Result<ActivityEntity, ActivityError>> {
    try {
      const activity = await db.activity.findUnique({
        where: { id },
        select: activityPayload.select,
      });
      if (!activity)
        return Result.fail({
          type: "ACTIVITY_NOT_FOUND",
          message: "No se supo encontrar la actividad seleccionada",
        });

      return Result.ok(ActivityMapper.toDomain(activity));
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === "P2006")
          return Result.fail({
            type: "BAD_REQUEST",
            message: `Valor para ${error.meta?.taget} no es valido`,
          });

      return Result.fail({ type: "DATABASE_ERROR", message: String(error) });
    }
  }
}
