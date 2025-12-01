import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { HashingService } from './hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}
  async signUp(signUpDto: CreateUserDto) {
    try {
      const { email, username, password } = signUpDto;
      const hashedPassword = await this.hashingService.hash(password);
      const newUser = this.userRepository.create({
        email,
        username,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);
      return {
        user: {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
