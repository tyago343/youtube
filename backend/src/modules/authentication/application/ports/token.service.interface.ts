import { AccessToken } from '../../domain/vo/access-token.vo';
import { RefreshToken } from '../../domain/vo/refresh-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';

export abstract class TokenService {
  abstract generateToken(payload: TokenPayload): Promise<AccessToken>;
  abstract generateRefreshToken(payload: TokenPayload): Promise<RefreshToken>;
  abstract verifyToken(token: string): Promise<TokenPayload>;
  abstract verifyRefreshToken(token: string): Promise<TokenPayload>;
}
