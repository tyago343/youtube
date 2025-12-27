import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../modules/users/domain/user.entity';
import { UsersService } from '../modules/users/application/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../modules/users/presenters/http/dto/create-user.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const { email, username, password } = signUpDto;

    try {
      const newUser = await this.usersService.create(email, username, password);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      };
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';

      if ((error as { code?: string })?.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('User already exists');
      }

      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
    }

    if (user.password.value !== password) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }
}
