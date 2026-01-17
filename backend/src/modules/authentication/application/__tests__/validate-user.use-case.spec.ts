import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { PasswordHashingService } from 'src/modules/shared/application/ports/password-hashing.interface';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { User } from 'src/modules/users/domain/user.entity';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-crendetials.exception';
import { randomUUID } from 'crypto';
import { createUsersServiceMocks } from './mocks';
import { createPasswordHashingMocks } from 'src/modules/users/application/__tests__/mocks';

describe('ValidateUserUseCase', () => {
  let useCase: ValidateUserUseCase;
  let usersServiceMocks: ReturnType<typeof createUsersServiceMocks>;
  let passwordHashingMocks: ReturnType<typeof createPasswordHashingMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const password = 'ValidPass123';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    usersServiceMocks = createUsersServiceMocks();
    passwordHashingMocks = createPasswordHashingMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserUseCase,
        {
          provide: UsersService,
          useValue: usersServiceMocks.service,
        },
        {
          provide: PasswordHashingService,
          useValue: passwordHashingMocks.service,
        },
      ],
    }).compile();

    useCase = module.get<ValidateUserUseCase>(ValidateUserUseCase);
  });

  it('should return user when credentials are valid', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    usersServiceMocks.findOne.mockResolvedValue(user);
    passwordHashingMocks.verify.mockResolvedValue(true);

    const result = await useCase.execute(email, password);

    expect(result).toBe(user);
    expect(usersServiceMocks.findOne).toHaveBeenCalledWith(email);
    expect(passwordHashingMocks.verify).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
  });

  it('should throw InvalidCredentialsException when user is not found', async () => {
    usersServiceMocks.findOne.mockResolvedValue(null);

    await expect(useCase.execute(email, password)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(usersServiceMocks.findOne).toHaveBeenCalledWith(email);
    expect(passwordHashingMocks.verify).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsException when password is invalid', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    usersServiceMocks.findOne.mockResolvedValue(user);
    passwordHashingMocks.verify.mockResolvedValue(false);

    await expect(useCase.execute(email, password)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(usersServiceMocks.findOne).toHaveBeenCalledWith(email);
    expect(passwordHashingMocks.verify).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
  });

  it('should use the hashed password from user entity for verification', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    usersServiceMocks.findOne.mockResolvedValue(user);
    passwordHashingMocks.verify.mockResolvedValue(true);

    await useCase.execute(email, password);

    expect(passwordHashingMocks.verify).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
  });

  it('should propagate errors from user service', async () => {
    const error = new Error('Database error');

    usersServiceMocks.findOne.mockRejectedValue(error);

    await expect(useCase.execute(email, password)).rejects.toThrow(error);
    expect(usersServiceMocks.findOne).toHaveBeenCalledWith(email);
    expect(passwordHashingMocks.verify).not.toHaveBeenCalled();
  });

  it('should propagate errors from password hashing service', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });
    const error = new Error('Hashing service error');

    usersServiceMocks.findOne.mockResolvedValue(user);
    passwordHashingMocks.verify.mockRejectedValue(error);

    await expect(useCase.execute(email, password)).rejects.toThrow(error);
    expect(usersServiceMocks.findOne).toHaveBeenCalledWith(email);
    expect(passwordHashingMocks.verify).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
  });

  it('should call services in correct order', async () => {
    const user = User.create({
      id: userId,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
    });

    usersServiceMocks.findOne.mockResolvedValue(user);
    passwordHashingMocks.verify.mockResolvedValue(true);

    await useCase.execute(email, password);

    // Verify that findOne is called before verify
    expect(usersServiceMocks.findOne).toHaveBeenCalled();
    expect(passwordHashingMocks.verify).toHaveBeenCalled();

    // Verify call order by checking invocation order
    const findOneCallOrder =
      usersServiceMocks.findOne.mock.invocationCallOrder[0];
    const verifyCallOrder =
      passwordHashingMocks.verify.mock.invocationCallOrder[0];

    expect(findOneCallOrder).toBeLessThan(verifyCallOrder);
  });
});
