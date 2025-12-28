import { AccessToken } from '../../domain/vo/access-token.vo';
import { TokenPayload } from '../../domain/vo/token-payload.vo';

export abstract class TokenService {
  abstract generateToken(payload: TokenPayload): Promise<AccessToken>;
  abstract verifyToken(token: string): Promise<TokenPayload>;
}
