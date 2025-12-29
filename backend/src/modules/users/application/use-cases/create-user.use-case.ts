import { Injectable } from '@nestjs/common';
import { UserFactory } from '../../domain/factories/user.factory';
import { User } from '../../domain/user.entity';
import { PasswordHashingService } from '../../../shared/application/ports/password-hashing.interface';
import { UserRepository } from '../ports/user.repository';
import { Email } from '../../domain/vo/email.vo';
import { Username } from '../../domain/vo/username.vo';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';

@Injectable()
export class CreateUserUseCase {
  //   private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly passwordHashingService: PasswordHashingService,
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

    return this.userRepository.save(user);
  }
}
