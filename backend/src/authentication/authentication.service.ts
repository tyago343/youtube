import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from '../users/dto/create-user.request.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const { email, username, password } = signUpDto;

    this.logger.info(
      '{ email: email, username: username }',
      'Attempting to create new user account',
    );

    try {
      const hashedPassword = await this.hashingService.hash(password);

      const newUser = await this.usersService.createUser({
        email,
        username,
        password: hashedPassword,
      });

      this.logger.info(
        '{ userId: newUser.id, email: newUser.email, username: newUser.username }',
        'User account created successfully',
      );

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
        this.logger.warn(
          '{ email: email, username: username }',
          'User creation failed: Email or username already exists',
        );
        throw new ConflictException('User already exists');
      }

      this.logger.error('', 'Unexpected error during user signup');

      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.debug('{ email: email }', 'Validating user credentials');

    try {
      const user = await this.usersService.findOne(email);

      if (!user) {
        this.logger.warn(
          '{ email: email }',
          'User not found during login attempt',
        );
        return null;
      }

      const isPasswordValid = await this.hashingService.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(
          '{ userId: user.id, email: email }',
          'Invalid password provided during login attempt',
        );
        return null;
      }

      this.logger.info(
        '{ userId: user.id, email: email }',
        'User credentials validated successfully',
      );

      return user;
    } catch (error) {
      this.logger.error('', 'Error during user validation');
      throw error;
    }
  }

  async login(user: User) {
    this.logger.info(
      '{ userId: user.id, email: user.email }',
      'Generating JWT token for user login',
    );

    try {
      const payload = { email: user.email, sub: user.id };
      const accessToken = await this.jwtService.signAsync(payload);

      this.logger.info(
        '{ userId: user.id, email: user.email }',
        'User logged in successfully',
      );

      return {
        accessToken,
        user,
      };
    } catch (error) {
      this.logger.error('', 'Error generating JWT token');
      throw error;
    }
  }
}
