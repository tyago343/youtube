import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class DeleteUserUseCase {
  //   private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // this.logger.debug(`Deleting user: ${id}`);

    const userId = UserId.create(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    await this.userRepository.delete(userId);
  }
}
