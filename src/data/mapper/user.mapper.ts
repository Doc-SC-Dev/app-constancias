/** biome-ignore-all lint/complexity/noStaticOnlyClass: is a mapper class */
import type { UserEntity } from "@/core/entities/user.entity";
import { Prisma } from "@/generated/prisma";

const fullUser = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
    rut: true,
    createdAt: true,
    isDirector: true,
    gender: true,
    role: true,
    image: true,
    banned: true,
    academicDegree: {
      select: {
        name: true,
        title: true,
      },
    },
  },
});

export class UserMapper {
  static toDomain(
    userPrisma: Prisma.UserGetPayload<typeof fullUser>,
  ): UserEntity {
    return {
      id: userPrisma.id,
      name: userPrisma.name,
      rut: userPrisma.rut,
      email: userPrisma.email,
      gender: userPrisma.gender,
      isDirector: userPrisma.isDirector,
      role: userPrisma.role,
      academicDegree: userPrisma.academicDegree?.name,
      banned: userPrisma.banned,
      title: userPrisma.academicDegree?.title.filter(
        (t) => t.gender === userPrisma.gender,
      )[0].abbrev,
      image: userPrisma.image,
    };
  }
}
