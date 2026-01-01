import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../domain/user.entity';

export class OwnerSummaryDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

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

  static fromDomain(user: User): OwnerSummaryDto {
    const dto = new OwnerSummaryDto();
    dto.id = user.id.value;
    dto.username = user.username.value;
    dto.avatarUrl = user.avatarUrl;
    return dto;
  }
}
