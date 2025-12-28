import { ApiProperty } from '@nestjs/swagger';
import { AccessToken } from 'src/modules/authentication/domain/vo/access-token.vo';
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
  @ApiProperty({
    description: 'The user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
  static fromDomain(auth: {
    accessToken: AccessToken;
    user: UserResponseDto;
  }): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.accessToken = auth.accessToken.value;
    dto.user = auth.user;
    return dto;
  }
}
