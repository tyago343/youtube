import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    try {
      const { email, username, password } = signUpDto;
      const hashedPassword = await this.hashingService.hash(password);
      const newUser = await this.usersService.createUser({
        email,
        username,
        password: hashedPassword,
      });
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
    if (user && (await this.hashingService.compare(password, user.password))) {
      return user;
    }
    return null;
  }
  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
