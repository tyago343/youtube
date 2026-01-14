import { ApiProperty } from '@nestjs/swagger';
import { Channel } from 'src/modules/channels/domain/channel.entity';

export class ChannelSummaryDto {
  @ApiProperty({
    description: 'The id of the channel',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the channel',
    example: 'My Channel',
  })
  name: string;

  @ApiProperty({
    description: 'The avatar URL of the channel',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  avatarUrl?: string;

  static fromDomain(channel: Channel): ChannelSummaryDto {
    const dto = new ChannelSummaryDto();
    dto.id = channel.id.value;
    dto.name = channel.name;
    dto.avatarUrl = channel.avatarUrl;
    return dto;
  }
}
