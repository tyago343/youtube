import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { GetAllUsersUseCase } from '../use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UploadAvatarUseCase } from '../use-cases/upload-avatar.use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { User } from '../../domain/user.entity';
import { FileStorageService } from 'src/modules/shared/application/ports/file-storage.interface';

@Injectable()
export class UsersService {
  private readonly AVATAR_FOLDER = 'avatars';

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly storageService: FileStorageService,
  ) {}

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    return this.createUserUseCase.execute(email, username, password);
  }

  async findOne(identifier: string): Promise<User> {
    return this.getUserUseCase.execute(identifier);
  }

  async findAll(): Promise<User[]> {
    return this.getAllUsersUseCase.execute();
  }

  async update(
    id: string,
    data: { email?: string; username?: string },
    currentUserId: string,
  ): Promise<User> {
    this.ensureOwnership(id, currentUserId);
    return this.updateUserUseCase.execute(id, data);
  }

  async uploadAvatar(
    id: string,
    avatar: Express.Multer.File,
    currentUserId: string,
  ): Promise<{ avatarUrl: string }> {
    this.ensureOwnership(id, currentUserId);

    const avatarUrl = await this.storageService.uploadFile(avatar, {
      folder: this.AVATAR_FOLDER,
    });

    const user = await this.uploadAvatarUseCase.execute(id, avatarUrl.url);

    return { avatarUrl: user.avatarUrl || avatarUrl.url };
  }

  async delete(id: string, currentUserId: string): Promise<void> {
    this.ensureOwnership(id, currentUserId);
    await this.deleteUserUseCase.execute(id);
  }

  private ensureOwnership(resourceId: string, currentUserId: string): void {
    if (currentUserId !== resourceId) {
      throw new ForbiddenException(
        'You can only perform this action on your own resource',
      );
    }
  }
}
