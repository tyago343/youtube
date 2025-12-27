import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../ports/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  //   private readonly logger = new Logger(GetAllUsersUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    // this.logger.debug('Finding all users');
    return this.userRepository.findAll();
  }
}
