import { Injectable } from '@nestjs/common';
import { UserFactory } from '../../domain/factories/user.factory';
import { User } from '../../domain/user.entity';
import { PasswordHashingService } from '../../../shared/application/ports/password-hashing.interface';
import { EventBus } from '../../../shared/application/ports/event-bus.interface';
import { UserCreatedEvent } from '../../../shared/domain/events';
import { UserRepository } from '../ports/user.repository';
import { Email } from '../../domain/vo/email.vo';
import { Username } from '../../domain/vo/username.vo';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    // this.logger.debug(`Creating user: ${JSON.stringify({ email, username })}`);

    const emailVO = Email.create(email);
    const usernameVO = Username.create(username);

    const emailExists = await this.userRepository.existsByEmail(emailVO);
    if (emailExists) {
      throw new UserAlreadyExistsException('email', email);
    }

    const usernameExists =
      await this.userRepository.existsByUsername(usernameVO);
    if (usernameExists) {
      throw new UserAlreadyExistsException('username', username);
    }

    const hashedPassword = await this.passwordHashingService.hash(password);

    const user = this.userFactory.create(email, username, hashedPassword);

    const savedUser = await this.userRepository.save(user);

    this.eventBus.publish(
      new UserCreatedEvent({
        email: savedUser.email.value,
        username: savedUser.username.value,
      }),
    );

    return savedUser;
  }
}
