import type { Role } from "@/lib/authorization/permissions";
import { db, dbWithAutdit } from "@/lib/db/prisma";
import type { PaginationResponse } from "@/lib/types/pagination";
import { PAGE_SIZE } from "@/lib/types/pagination";
import { Result } from "@/shared/core/Result";
import type {
  ActivityType,
  CreateActivityTypeInput,
  CreateParticipantTypeInput,
  UpdateParticipantTypeInput,
} from "../domain/ActivityType";
import { ActivityTypeError } from "../domain/ActivityTypeError";
import type { ActivityTypeRepository } from "../domain/ActivityTypeRepository";

export class ActivityTypeRepositoryImpl implements ActivityTypeRepository {
  async findById(id: string): Promise<Result<ActivityType, ActivityTypeError>> {
    try {
      const data = await db.activityType.findUnique({
        where: { id },
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

      if (!data) {
        return Result.fail(ActivityTypeError.notFound());
      }

      return Result.ok(data as ActivityType);
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async findAllPaged(
    page: number,
  ): Promise<Result<PaginationResponse<ActivityType>, ActivityTypeError>> {
    try {
      const [count, activityTypes] = await db.$transaction([
        db.activityType.count(),
        db.activityType.findMany({
          orderBy: { createdAt: "desc" },
          take: PAGE_SIZE,
          skip: PAGE_SIZE * page,
          select: {
            id: true,
            name: true,
            createdAt: true,
            _count: {
              select: {
                participantTypes: true,
                activities: true,
                template: true,
              },
            },
          },
        }),
      ]);

      const data = activityTypes.map((at) => ({
        ...at,
        participantTypes: [], // Not loaded in list view
      })) as ActivityType[];

      return Result.ok({
        data,
        nextPage: page + 1,
        totalRows: count,
      });
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async create(
    data: CreateActivityTypeInput,
  ): Promise<Result<ActivityType, ActivityTypeError>> {
    try {
      const result = await dbWithAutdit().activityType.create({
        data: {
          name: data.name,
          participantTypes: {
            createMany: {
              data: data.participantTypes,
            },
          },
        },
        include: {
          _count: {
            select: {
              participantTypes: true,
              activities: true,
              template: true,
            },
          },
        },
      });

      return Result.ok({
        ...result,
        participantTypes: [], // Re-fetch or return empty for now
      } as ActivityType);
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async update(
    id: string,
    name: string,
  ): Promise<Result<ActivityType, ActivityTypeError>> {
    try {
      const result = await dbWithAutdit().activityType.update({
        where: { id },
        data: { name },
        include: {
          _count: {
            select: {
              participantTypes: true,
              activities: true,
              template: true,
            },
          },
        },
      });
      return Result.ok({
        ...result,
        participantTypes: [],
      } as ActivityType);
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async delete(
    id: string,
  ): Promise<Result<{ name: string }, ActivityTypeError>> {
    try {
      const activityType = await db.activityType.findUnique({
        where: { id },
        select: {
          _count: {
            select: {
              activities: true,
              template: true,
              participantTypes: {
                where: {
                  template: { some: {} },
                },
              },
            },
          },
        },
      });

      if (!activityType) {
        return Result.fail(ActivityTypeError.notFound());
      }

      if (
        activityType._count.activities > 0 ||
        activityType._count.template > 0 ||
        activityType._count.participantTypes > 0
      ) {
        return Result.fail(
          ActivityTypeError.hasRelations(
            "No se puede eliminar porque tiene actividades o plantillas asociadas",
          ),
        );
      }

      const deleted = await dbWithAutdit().activityType.delete({
        where: { id },
        select: { name: true },
      });

      return Result.ok(deleted);
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async createParticipantType(
    data: CreateParticipantTypeInput,
  ): Promise<
    Result<ActivityType["participantTypes"][number], ActivityTypeError>
  > {
    try {
      const pt = await dbWithAutdit().participantType.create({
        data: {
          name: data.name,
          required: data.required,
          roles: data.roles as Role[],
          activityType: { connect: { id: data.activityTypeId } },
        },
      });
      return Result.ok(
        pt as unknown as ActivityType["participantTypes"][number],
      );
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async updateParticipantType(
    data: UpdateParticipantTypeInput,
  ): Promise<
    Result<ActivityType["participantTypes"][number], ActivityTypeError>
  > {
    try {
      const pt = await dbWithAutdit().participantType.update({
        where: { id: data.id },
        data: {
          name: data.name,
          required: data.required,
          roles: data.roles as Role[],
        },
      });
      return Result.ok(
        pt as unknown as ActivityType["participantTypes"][number],
      );
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }

  async deleteParticipantType(
    id: string,
  ): Promise<Result<{ id: string }, ActivityTypeError>> {
    try {
      await dbWithAutdit().participantType.delete({ where: { id } });
      return Result.ok({ id });
    } catch (error) {
      console.error(error);
      return Result.fail(ActivityTypeError.databaseError());
    }
  }
}
