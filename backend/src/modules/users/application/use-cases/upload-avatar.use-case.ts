import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class UploadAvatarUseCase {
  //   private readonly logger = new Logger(UploadAvatarUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, avatarUrl: string): Promise<User> {
    // this.logger.debug(`Uploading avatar for user: ${userId}`);

    const id = UserId.create(userId);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    user.changeAvatar(avatarUrl);

    return this.userRepository.save(user);
  }
}
