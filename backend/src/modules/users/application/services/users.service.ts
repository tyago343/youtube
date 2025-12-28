import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { GetAllUsersUseCase } from '../use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UploadAvatarUseCase } from '../use-cases/upload-avatar.use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exceptions';
import { InvalidEmailException } from '../../domain/exceptions/invalid-email.exception';
import { InvalidUsernameException } from '../../domain/exceptions/invalid-username.exception';
import { InvalidPasswordException } from '../../domain/exceptions/invalid-password.exception';
import { InvalidAvatarUrlException } from '../../domain/exceptions/invalid-avatar-url.exception';
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
    try {
      return await this.createUserUseCase.execute(email, username, password);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      if (
        error instanceof InvalidEmailException ||
        error instanceof InvalidUsernameException ||
        error instanceof InvalidPasswordException
      ) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async findOne(identifier: string): Promise<User> {
    try {
      return await this.getUserUseCase.execute(identifier);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.getAllUsersUseCase.execute();
  }

  async update(
    id: string,
    data: { email?: string; username?: string },
    currentUserId: string,
  ): Promise<User> {
    this.ensureOwnership(id, currentUserId);

    try {
      return await this.updateUserUseCase.execute(id, data);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      if (
        error instanceof InvalidEmailException ||
        error instanceof InvalidUsernameException
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async uploadAvatar(
    id: string,
    avatar: Express.Multer.File,
    currentUserId: string,
  ): Promise<{ avatarUrl: string }> {
    this.ensureOwnership(id, currentUserId);

    try {
      const avatarUrl = await this.storageService.uploadFile(avatar, {
        folder: this.AVATAR_FOLDER,
      });

      const user = await this.uploadAvatarUseCase.execute(id, avatarUrl.url);

      return { avatarUrl: user.avatarUrl || avatarUrl.url };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidAvatarUrlException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async delete(id: string, currentUserId: string): Promise<void> {
    this.ensureOwnership(id, currentUserId);

    try {
      await this.deleteUserUseCase.execute(id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  private ensureOwnership(resourceId: string, currentUserId: string): void {
    if (currentUserId !== resourceId) {
      throw new ForbiddenException(
        'You can only perform this action on your own resource',
      );
    }
  }
}
