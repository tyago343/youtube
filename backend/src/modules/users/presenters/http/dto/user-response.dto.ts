import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../domain/user.entity';

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
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'The creation date of the user',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The user role (USER, MODERATOR, LEGAL)',
    example: 'USER',
  })
  role: string;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id.value;
    dto.email = user.email.value;
    dto.username = user.username.value;
    dto.avatarUrl = user.avatarUrl;
    dto.createdAt = user.createdAt || new Date();
    dto.role = user.role.value;
    return dto;
  }
}
