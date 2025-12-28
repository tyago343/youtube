import { DynamicModule, Module, Type } from '@nestjs/common';

// Use Cases
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { UploadAvatarUseCase } from './use-cases/upload-avatar.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';

// Services
import { UsersService } from './services/users.service';

// Domain
import { UserFactory } from '../domain/factories/user.factory';

// Infrastructure
import { SharedModule } from '../../shared/shared.module';

const useCases = [
  CreateUserUseCase,
  GetUserUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  UploadAvatarUseCase,
  DeleteUserUseCase,
];

@Module({
  providers: [...useCases, UserFactory, UsersService],
  exports: [...useCases, UsersService],
})
export class UsersApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: UsersApplicationModule,
      imports: [infrastructureModule, SharedModule],
      providers: [...useCases, UserFactory, UsersService],
      exports: [...useCases, UsersService],
    };
  }
}
