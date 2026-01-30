import type { Result } from "@/shared/core/Result";
import type { UserEntity } from "../../entities/user.entity";
import type { UserError } from "../../errors/users-errors";
import type { IUserRepository } from "../../interfaces/repositories/user-respository.interface";

export class FindUserUseCase {
  constructor(private userRepo: IUserRepository) {}
  async execute(id: string): Promise<Result<UserEntity, UserError>> {
    return await this.userRepo.findById(id);
  }
}
