import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/user.entity';
import { PasswordVerifier } from '../ports/password-verifier.interface';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-crendetials.exception';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private readonly passwordVerifier: PasswordVerifier,
    private readonly userService: UsersService,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const isValid = await this.passwordVerifier.verify(
      password,
      user.password.value,
    );
    if (!isValid) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}
