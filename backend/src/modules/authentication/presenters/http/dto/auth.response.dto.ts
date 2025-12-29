import { ApiProperty } from '@nestjs/swagger';
import { AccessToken } from 'src/modules/authentication/domain/vo/access-token.vo';
import { RefreshToken } from 'src/modules/authentication/domain/vo/refresh-token.vo';
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The JWT refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  static fromDomain(auth: {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    user: UserResponseDto;
  }): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.accessToken = auth.accessToken.value;
    dto.refreshToken = auth.refreshToken.value;
    dto.user = auth.user;
    return dto;
  }
}
