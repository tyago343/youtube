import { Test, TestingModule } from '@nestjs/testing';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserId } from '../../domain/vo/user-id.vo';
import { Email } from '../../domain/vo/email.vo';
import { randomUUID } from 'crypto';
import { createUserRepositoryMocks } from './mocks';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetUserUseCase>(GetUserUseCase);
  });

  it('should get a user by UUID', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId);

    expect(result).toBe(user);
    expect(userRepositoryMocks.findById).toHaveBeenCalledWith(
      expect.any(UserId),
    );
    expect(userRepositoryMocks.findByEmail).not.toHaveBeenCalled();
  });

  it('should get a user by email when not found by UUID', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(null);
    userRepositoryMocks.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute(email);

    expect(result).toBe(user);
    expect(userRepositoryMocks.findById).not.toHaveBeenCalled();
    expect(userRepositoryMocks.findByEmail).toHaveBeenCalledWith(
      expect.any(Email),
    );
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    userRepositoryMocks.findById.mockResolvedValue(null);
    userRepositoryMocks.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(email)).rejects.toThrow(UserNotFoundException);

    expect(userRepositoryMocks.findById).not.toHaveBeenCalled();
    expect(userRepositoryMocks.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundException when identifier is not a valid UUID or email', async () => {
    userRepositoryMocks.findById.mockResolvedValue(null);
    userRepositoryMocks.findByEmail.mockResolvedValue(null);

    const invalidIdentifier = 'not-a-uuid-or-email';

    await expect(useCase.execute(invalidIdentifier)).rejects.toThrow(
      UserNotFoundException,
    );

    expect(userRepositoryMocks.findById).not.toHaveBeenCalled();
    expect(userRepositoryMocks.findByEmail).not.toHaveBeenCalled();
  });

  it('should prioritize UUID search over email search', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId);

    expect(result).toBe(user);
    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.findByEmail).not.toHaveBeenCalled();
  });

  it('should attempt to search by email when UUID is not valid but string is a valid email', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(null);
    userRepositoryMocks.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute(email);

    expect(result).toBe(user);
    expect(userRepositoryMocks.findById).not.toHaveBeenCalled();
    expect(userRepositoryMocks.findByEmail).toHaveBeenCalledTimes(1);
  });
});
