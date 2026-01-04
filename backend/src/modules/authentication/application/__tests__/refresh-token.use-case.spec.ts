import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { TokenService } from '../ports/token.service.interface';
import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';
import { UnauthorizedException } from '@nestjs/common';
import { TokenExpiredException } from '../../domain/exceptions/token-expired.exception';
import { createTokenServiceMocks } from './mocks';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let tokenServiceMocks: ReturnType<typeof createTokenServiceMocks>;

  const userId = 'user-id-123';
  const email = 'test@example.com';
  const refreshTokenString = 'valid-refresh-token';

  beforeEach(async () => {
    tokenServiceMocks = createTokenServiceMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        {
          provide: TokenService,
          useValue: tokenServiceMocks.service,
        },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should generate new access and refresh tokens from valid refresh token', async () => {
    const payload = new TokenPayload(userId, email);
    const newAccessToken = AccessToken.create('new-access-token');
    const newRefreshToken = RefreshToken.create('new-refresh-token');

    tokenServiceMocks.verifyRefreshToken.mockResolvedValue(payload);
    tokenServiceMocks.generateToken.mockResolvedValue(newAccessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(newRefreshToken);

    const result = await useCase.execute(refreshTokenString);

    expect(result).toEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    expect(tokenServiceMocks.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(tokenServiceMocks.generateToken).toHaveBeenCalledWith(payload);
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledWith(
      payload,
    );
  });

  it('should throw UnauthorizedException when refresh token is invalid', async () => {
    const error = new Error('Invalid token');

    tokenServiceMocks.verifyRefreshToken.mockRejectedValue(error);

    await expect(useCase.execute(refreshTokenString)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(tokenServiceMocks.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(tokenServiceMocks.generateToken).not.toHaveBeenCalled();
    expect(tokenServiceMocks.generateRefreshToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when refresh token is expired', async () => {
    const error = new TokenExpiredException();

    tokenServiceMocks.verifyRefreshToken.mockRejectedValue(error);

    await expect(useCase.execute(refreshTokenString)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(tokenServiceMocks.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(tokenServiceMocks.generateToken).not.toHaveBeenCalled();
    expect(tokenServiceMocks.generateRefreshToken).not.toHaveBeenCalled();
  });

  it('should preserve error message when throwing UnauthorizedException', async () => {
    const errorMessage = 'Token has expired';
    const error = new TokenExpiredException(errorMessage);

    tokenServiceMocks.verifyRefreshToken.mockRejectedValue(error);

    await expect(useCase.execute(refreshTokenString)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should use the same payload for both new tokens', async () => {
    const payload = new TokenPayload(userId, email);
    const newAccessToken = AccessToken.create('new-access-token');
    const newRefreshToken = RefreshToken.create('new-refresh-token');

    tokenServiceMocks.verifyRefreshToken.mockResolvedValue(payload);
    tokenServiceMocks.generateToken.mockResolvedValue(newAccessToken);
    tokenServiceMocks.generateRefreshToken.mockResolvedValue(newRefreshToken);

    await useCase.execute(refreshTokenString);

    expect(tokenServiceMocks.generateToken).toHaveBeenCalledWith(payload);
    expect(tokenServiceMocks.generateRefreshToken).toHaveBeenCalledWith(
      payload,
    );
  });
});
