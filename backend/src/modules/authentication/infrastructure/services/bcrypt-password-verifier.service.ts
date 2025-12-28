import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordVerifier } from '../../application/ports/password-verifier.interface';

@Injectable()
export class BcryptPasswordVerifierService implements PasswordVerifier {
  async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
