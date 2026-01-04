import { TokenService } from '../../ports/token.service.interface';

export interface TokenServiceMocks {
  generateToken: jest.Mock;
  generateRefreshToken: jest.Mock;
  verifyToken: jest.Mock;
  verifyRefreshToken: jest.Mock;
  service: jest.Mocked<TokenService>;
}

export function createTokenServiceMocks(): TokenServiceMocks {
  const generateToken = jest.fn();
  const generateRefreshToken = jest.fn();
  const verifyToken = jest.fn();
  const verifyRefreshToken = jest.fn();

  const service = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
  } as jest.Mocked<TokenService>;

  return {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    service,
  };
}
