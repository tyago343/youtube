export abstract class PasswordVerifier {
  abstract verify(password: string, hashedPassword: string): Promise<boolean>;
}
