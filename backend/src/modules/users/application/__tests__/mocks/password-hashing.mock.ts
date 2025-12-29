import { PasswordHashingService } from '../../../../shared/application/ports/password-hashing.interface';

export interface PasswordHashingMocks {
  hash: jest.Mock;
  verify: jest.Mock;
  service: jest.Mocked<PasswordHashingService>;
}

export function createPasswordHashingMocks(): PasswordHashingMocks {
  const hash = jest.fn();
  const verify = jest.fn();

  const service = {
    hash,
    verify,
  } as jest.Mocked<PasswordHashingService>;

  return {
    hash,
    verify,
    service,
  };
}
