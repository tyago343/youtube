import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://storage.example.com/avatars/user123.jpg',
    required: false,
    nullable: true,
  })
  avatarUrl?: string;
}

export class SignupResponseDto {
  @ApiProperty({
    description: 'The user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
  // TODO: Add JWT access token in signup response
  // @ApiProperty({
  //   description: 'The JWT access token for authentication',
  //   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  // })
  // accessToken?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The authenticated user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
