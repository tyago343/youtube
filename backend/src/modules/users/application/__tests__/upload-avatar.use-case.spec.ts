import { Test, TestingModule } from '@nestjs/testing';
import { UploadAvatarUseCase } from '../use-cases/upload-avatar.use-case';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { InvalidAvatarUrlException } from '../../domain/exceptions/invalid-avatar-url.exception';
import { randomUUID } from 'crypto';
import { createUserRepositoryMocks } from './mocks';

describe('UploadAvatarUseCase', () => {
  let useCase: UploadAvatarUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';
  const validAvatarUrl = 'https://example.com/avatar.jpg';

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadAvatarUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<UploadAvatarUseCase>(UploadAvatarUseCase);
  });

  it('should update avatar successfully', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.save.mockResolvedValue(user);

    const result = await useCase.execute(userId, validAvatarUrl);

    expect(result.avatarUrl).toBe(validAvatarUrl);
    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    userRepositoryMocks.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId, validAvatarUrl)).rejects.toThrow(
      UserNotFoundException,
    );

    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidAvatarUrlException when URL is empty', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);

    await expect(useCase.execute(userId, '')).rejects.toThrow(
      InvalidAvatarUrlException,
    );

    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(0);
  });

  it('should throw InvalidAvatarUrlException when URL is invalid', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);

    await expect(useCase.execute(userId, 'not-a-url')).rejects.toThrow(
      InvalidAvatarUrlException,
    );

    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(0);
  });

  it('should save changes to repository after updating avatar', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.save.mockResolvedValue(user);

    await useCase.execute(userId, validAvatarUrl);

    expect(userRepositoryMocks.save).toHaveBeenCalledTimes(1);
    expect(user.avatarUrl).toBe(validAvatarUrl);
  });

  it('should accept different valid URL formats', async () => {
    const urls = [
      'https://example.com/avatar.jpg',
      'http://example.com/avatar.png',
      'https://cdn.example.com/users/123/avatar',
    ];

    for (const url of urls) {
      const testUserId = randomUUID();
      const user = User.create(testUserId, email, username, hashedPassword);
      userRepositoryMocks.findById.mockResolvedValue(user);
      userRepositoryMocks.save.mockResolvedValue(user);

      const result = await useCase.execute(testUserId, url);
      expect(result.avatarUrl).toBe(url);
    }
  });
});
