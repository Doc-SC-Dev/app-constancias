import { Result } from "@/shared/core/Result";
import type { UserCreateDto } from "../../dtos/user/create-user.dto";
import type { UserEntity } from "../../entities/user.entity";
import type { UserError } from "../../errors/users-errors";
import type { IUserRepository } from "../../interfaces/repositories/user-respository.interface";

export class CreateUserUseCase {
  constructor(private userRespository: IUserRepository) {}
  async execute(
    userData: UserCreateDto,
  ): Promise<Result<UserEntity, UserError>> {
    const result = await this.userRespository.create(userData);
    if (!result.isSuccess) {
      return Result.fail(result.getError);
    }
    return Result.ok(result.getValue);
  }
}
