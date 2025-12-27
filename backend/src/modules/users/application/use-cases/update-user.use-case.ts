import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';

@Injectable()
export class UpdateUserUseCase {
  //   private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    data: { email?: string; username?: string },
  ): Promise<User> {
    // this.logger.debug(`Updating user: ${id}`);

    const userId = UserId.create(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    if (data.email) {
      const newEmail = Email.create(data.email);
      const emailExists = await this.userRepository.existsByEmail(newEmail);
      if (emailExists && !user.email.equals(newEmail)) {
        throw new UserAlreadyExistsException('email', data.email);
      }
      user.updateEmail(data.email);
      //   this.logger.debug(`Updating email for user ${id} to ${data.email}`);
    }

    if (data.username) {
      const newUsername = Username.create(data.username);
      const usernameExists =
        await this.userRepository.existsByUsername(newUsername);
      if (usernameExists && !user.username.equals(newUsername)) {
        throw new UserAlreadyExistsException('username', data.username);
      }
      user.updateUsername(data.username);
      //   this.logger.debug(`Updating username for user ${id} to ${data.username}`);
    }

    return this.userRepository.save(user);
  }
}
