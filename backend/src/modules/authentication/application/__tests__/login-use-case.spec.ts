import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '../use-cases/login-use-case';
import { TokenService } from '../ports/token.service.interface';
import { User } from 'src/modules/users/domain/user.entity';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { randomUUID } from 'crypto';
import { createTokenServiceMocks } from './mocks';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let tokenServiceMocks: ReturnType<typeof createTokenServiceMocks>;

  const userId = randomUUID();
  const email = 'test@example.com';
  const username = 'testuser';
  const hashedPassword = '$2b$10$hashedpasswordstringhere';

  beforeEach(async () => {
    tokenServiceMocks = createTokenServiceMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: TokenService,
          useValue: tokenServiceMocks.service,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should generate access and refresh tokens for a valid user', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    const result = await useCase.execute(user);

    expect(result).toEqual({
      accessToken,
      refreshToken,
      user,
    });
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledWith(
      expect.any(TokenPayload),
    );
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledWith(
      expect.any(TokenPayload),
    );
  });

  it('should create TokenPayload with correct user id and email', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    await useCase.execute(user);

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

  it('should return the same user object passed as parameter', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    const accessToken = AccessToken.create('access-token');
    const refreshToken = RefreshToken.create('refresh-token');

    tokenServiceMocks.generateToken.mockResolvedValue(accessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(refreshToken);

    const result = await useCase.execute(user);

    expect(result.user).toBe(user);
  });

  it('should handle token generation errors', async () => {
    const user = User.create(userId, email, username, hashedPassword);
    const error = new Error('Token generation failed');

    tokenServiceMocks.generateToken.mockRejectedValue(error);

    await expect(useCase.execute(user)).rejects.toThrow(error);
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMocks.generateRefreshToken).not.toHaveBeenCalled();
  });
});
