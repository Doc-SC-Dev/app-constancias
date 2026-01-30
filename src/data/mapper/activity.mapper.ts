import type { ActivityEntity } from "@/core/entities/activity.entity";
import { Prisma } from "@/generated/prisma";

export const activityPayload = Prisma.validator<Prisma.ActivityDefaultArgs>()({
  select: {
    id: true,
    name: true,
    nParticipants: true,
    activityType: {
      select: {
        name: true,
      },
    },
    endAt: true,
    startAt: true,
    participants: {
      select: {
        id: true,
        hours: true,
        type: {
          select: {
            name: true,
            required: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    },
  },
});

// biome-ignore lint/complexity/noStaticOnlyClass: mapper class
export class ActivityMapper {
  static toDomain(
    prismaActivity: Prisma.ActivityGetPayload<typeof activityPayload>,
  ): ActivityEntity {
    return {
      ...prismaActivity,
      nParticpants: prismaActivity.nParticipants,
      type: prismaActivity.activityType.name,
      participants: prismaActivity.participants.map<{
        id: string;
        name: string;
        rol: string;
        rolRequied: boolean;
        hours: number;
      }>((p) => ({
        hours: p.hours,
        rol: p.type.name,
        rolRequied: p.type.required,
        name: p.user.name,
        id: p.id,
      })),
    };
  }
}
