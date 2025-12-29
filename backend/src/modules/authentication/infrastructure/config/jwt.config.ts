import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const secret = process.env.JWT_SECRET!;
  const accessTokenTtl = parseInt(
    process.env.JWT_ACCESS_TOKEN_TTL ?? '3600',
    10,
  );
  const refreshTokenTtl = parseInt(
    process.env.JWT_REFRESH_TOKEN_TTL ?? '604800',
    10,
  );
  return {
    secret,
    accessTokenTtl,
    refreshTokenTtl,
  };
});
