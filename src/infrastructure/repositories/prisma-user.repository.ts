import { headers } from "next/headers";
import type { UserCreateDto } from "@/core/dtos/user/create-user.dto";
import type { UserEntity } from "@/core/entities/user.entity";
import type { UserError } from "@/core/errors/users-errors";
import type { IUserRepository } from "@/core/interfaces/repositories/user-respository.interface";
import { UserMapper } from "@/data/mapper/user.mapper";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { type Role, Roles } from "@/lib/authorization/permissions";
import { db, dbWithAutdit } from "@/lib/db/prisma";
import { Result } from "@/shared/core/Result";

export class PrismaUserRepository implements IUserRepository {
  async create(data: UserCreateDto): Promise<Result<UserEntity, UserError>> {
    try {
      const { studentId, rut, academicGrade, gender, role, ...newUserData } =
        data;
      const password = rut.replaceAll(".", "");
      const user = await dbWithAutdit().$transaction(async (tx) => {
        // try to create user
        const session = await auth.api.createUser({
          headers: await headers(),
          body: {
            ...newUserData,
            role,
            password,
            data: {
              gender,
              rut,
              acadmicDegreeId: academicGrade,
              isDirector: false,
            },
          },
        });
        if (!session) throw new Error("USER_EXISTS");

        if (session.user.role === Roles.STUDENT && studentId) {
          await tx.student.create({
            data: {
              studentId: parseInt(studentId, 10),
              isRegularStudent: false,
              user: {
                connect: {
                  id: session.user.id,
                },
              },
            },
          });
        }
        return session.user;
      });

      return Result.ok<UserEntity, UserError>({
        ...user,
        role: user.role ? (user.role as Role) : Roles.STUDENT,
        isDirector: false,
        gender: gender,
        rut: rut,
        image: user.image,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "USER_EXISTS")
          return Result.fail({
            type: "USER_ALREADY_EXISTS",
            message: "Ya existe un usuario con ese nombre o correo",
          });
      }
      return Result.fail({
        type: "DATABASE_ERROR",
        message: String(error),
      });
    }
  }
  async findById(id: string): Promise<Result<UserEntity, UserError>> {
    const getUserValue = Prisma.validator<Prisma.UserSelect>()({
      id: true,
      name: true,
      email: true,
      image: true,
      rut: true,
      gender: true,
      createdAt: true,
      isDirector: true,
      banned: true,
      role: true,
      academicDegree: {
        select: {
          name: true,
          title: true,
        },
      },
    });
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: getUserValue,
    });
    if (!user)
      return Result.fail({
        type: "USER_DOES_NOT_EXISTS",
        message: "El usuario que se esta buscando no existe",
      });

    const domainUser = UserMapper.toDomain(user);

    return Result.ok(domainUser);
  }
}
