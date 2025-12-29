import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { randomUUID } from 'crypto';
import { createUserRepositoryMocks } from './mocks';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepositoryMocks: ReturnType<typeof createUserRepositoryMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    userRepositoryMocks = createUserRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should delete a user successfully', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.delete.mockResolvedValue(undefined);

    await useCase.execute(userId);

    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    userRepositoryMocks.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(
      UserNotFoundException,
    );

    expect(userRepositoryMocks.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMocks.delete).not.toHaveBeenCalled();
  });

  it('should call repository delete method with correct UserId', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    userRepositoryMocks.findById.mockResolvedValue(user);
    userRepositoryMocks.delete.mockResolvedValue(undefined);

    await useCase.execute(userId);

    expect(userRepositoryMocks.delete).toHaveBeenCalledWith(expect.any(Object));
  });
});
