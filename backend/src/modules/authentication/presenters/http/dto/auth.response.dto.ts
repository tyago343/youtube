import { ApiProperty } from '@nestjs/swagger';
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
}
