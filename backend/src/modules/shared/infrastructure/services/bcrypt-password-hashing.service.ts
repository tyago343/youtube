import { Injectable } from '@nestjs/common';
import { PasswordHashingService } from '../../application/ports/password-hashing.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptPasswordHashingService implements PasswordHashingService {
  private readonly saltRounds = 10;
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }
  async verify(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
