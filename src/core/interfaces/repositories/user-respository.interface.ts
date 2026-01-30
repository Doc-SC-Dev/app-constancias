import type { Result } from "@/shared/core/Result";
import type { UserCreateDto } from "../../dtos/user/create-user.dto";
import type { UserEntity } from "../../entities/user.entity";
import type { UserError } from "../../errors/users-errors";

export interface IUserRepository {
  create(data: UserCreateDto): Promise<Result<UserEntity, UserError>>;
  findById(id: string): Promise<Result<UserEntity, UserError>>;
}
