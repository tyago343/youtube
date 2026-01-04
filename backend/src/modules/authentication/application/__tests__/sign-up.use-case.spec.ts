import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUseCase } from '../use-cases/sign-up.use-case';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { TokenService } from '../ports/token.service.interface';
import { User } from 'src/modules/users/domain/user.entity';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { randomUUID } from 'crypto';
import { createTokenServiceMocks, createUsersServiceMocks } from './mocks';

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;
  let tokenServiceMocks: ReturnType<typeof createTokenServiceMocks>;
  let usersServiceMocks: ReturnType<typeof createUsersServiceMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const password = 'ValidPass123';

  beforeEach(async () => {
    tokenServiceMocks = createTokenServiceMocks();
    usersServiceMocks = createUsersServiceMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
        {
          provide: UsersService,
          useValue: usersServiceMocks.service,
        },
        {
          provide: TokenService,
          useValue: tokenServiceMocks.service,
        },
      ],
    }).compile();

    useCase = module.get<SignUpUseCase>(SignUpUseCase);
  });

  it('should create a user and generate tokens successfully', async () => {
    const user = User.create(userId, email, username, 'hashed-password');
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    usersServiceMocks.create.mockResolvedValue(user);
    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    const result = await useCase.execute(email, username, password);

    expect(result).toEqual({
      accessToken,
      refreshToken,
      user,
    });
    expect(usersServiceMocks.create).toHaveBeenCalledWith(
      email,
      username,
      password,
    );
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('should create TokenPayload with correct user id and email', async () => {
    const user = User.create(userId, email, username, 'hashed-password');
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    usersServiceMocks.create.mockResolvedValue(user);
    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    await useCase.execute(email, username, password);

    const generateTokenCall =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      tokenServiceMocks.generateToken.mock.calls[0][0] as TokenPayload;

    const generateRefreshTokenCall =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      tokenServiceMocks.generateRefreshToken.mock.calls[0][0] as TokenPayload;

    expect(generateTokenCall).toBeInstanceOf(TokenPayload);
    expect(generateTokenCall.userId).toBe(userId);
    expect(generateTokenCall.email).toBe(email);
    expect(generateRefreshTokenCall).toBeInstanceOf(TokenPayload);
    expect(generateRefreshTokenCall.userId).toBe(userId);
    expect(generateRefreshTokenCall.email).toBe(email);
  });

  it('should propagate user creation errors', async () => {
    const error = new Error('User creation failed');

    usersServiceMocks.create.mockRejectedValue(error);

    await expect(useCase.execute(email, username, password)).rejects.toThrow(
      error,
    );
    expect(usersServiceMocks.create).toHaveBeenCalledWith(
      email,
      username,
      password,
    );
    expect(tokenServiceMocks.generateToken).not.toHaveBeenCalled();
    expect(tokenServiceMocks.generateRefreshToken).not.toHaveBeenCalled();
  });

  it('should propagate token generation errors', async () => {
    const user = User.create(userId, email, username, 'hashed-password');
    const error = new Error('Token generation failed');

    usersServiceMocks.create.mockResolvedValue(user);
    tokenServiceMocks.generateToken.mockRejectedValue(error);

    await expect(useCase.execute(email, username, password)).rejects.toThrow(
      error,
    );
    expect(usersServiceMocks.create).toHaveBeenCalledWith(
      email,
      username,
      password,
    );
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should call services in correct order', async () => {
    const user = User.create(userId, email, username, 'hashed-password');
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    usersServiceMocks.create.mockResolvedValue(user);
    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    await useCase.execute(email, username, password);

    // Verify that create is called before token generation
    expect(usersServiceMocks.create).toHaveBeenCalled();
    expect(tokenServiceMocks.generateToken).toHaveBeenCalled();
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalled();

    // Verify call order by checking that create was called first
    const createCallOrder =
      usersServiceMocks.create.mock.invocationCallOrder[0];
    const generateTokenCallOrder =
      tokenServiceMocks.generateToken.mock.invocationCallOrder[0];
    const generateRefreshTokenCallOrder =
      tokenServiceMocks.generateRefreshToken.mock.invocationCallOrder[0];

    expect(createCallOrder).toBeLessThan(generateTokenCallOrder);
    expect(generateTokenCallOrder).toBeLessThan(generateRefreshTokenCallOrder);
  });
});
