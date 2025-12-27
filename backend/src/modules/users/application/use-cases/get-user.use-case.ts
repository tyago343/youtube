import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../ports/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class GetUserUseCase {
  //   private readonly logger = new Logger(GetUserUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(identifier: string): Promise<User> {
    // this.logger.debug(`Finding user: ${identifier}`);

    let user: User | null = null;

    if (uuidValidate(identifier)) {
      const userId = UserId.create(identifier);
      user = await this.userRepository.findById(userId);
    }

    if (!user) {
      try {
        const email = Email.create(identifier);
        user = await this.userRepository.findByEmail(email);
      } catch {
        // Do nothing
      }
    }

    if (!user) {
      throw new UserNotFoundException(identifier);
    }

    return user;
  }
}
