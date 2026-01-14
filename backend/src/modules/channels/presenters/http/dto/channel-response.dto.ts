import { ApiProperty } from '@nestjs/swagger';
import { Channel } from 'src/modules/channels/domain/channel.entity';

export class ChannelResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the channel',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The owner user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId: string;

  @ApiProperty({
    description: 'The name of the channel',
    example: 'My Awesome Channel',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the channel',
    example: 'This is my channel description',
  })
  description: string;

  @ApiProperty({
    description: 'The status of the channel',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED', 'TERMINATED', 'INACTIVE', 'PENDING_REVIEW'],
  })
  status: string;

  @ApiProperty({
    description: 'The avatar URL of the channel',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'The banner URL of the channel',
    example: 'https://example.com/banner.jpg',
    required: false,
    nullable: true,
  })
  bannerUrl?: string;

  @ApiProperty({
    description: 'Whether monetization is enabled',
    example: false,
  })
  isMonetizationEnabled: boolean;

  @ApiProperty({
    description: 'The creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date',
    example: '2024-01-15T10:30:00Z',
    required: false,
    nullable: true,
  })
  updatedAt?: Date;

  static fromDomain(channel: Channel): ChannelResponseDto {
    const dto = new ChannelResponseDto();
    const primitives = channel.toPrimitives();
    dto.id = primitives.id;
    dto.ownerId = primitives.ownerId;
    dto.name = primitives.name;
    dto.description = primitives.description;
    dto.avatarUrl = primitives.avatarUrl;
    dto.bannerUrl = primitives.bannerUrl;
    dto.createdAt = primitives.createdAt;
    return dto;
  }
}
