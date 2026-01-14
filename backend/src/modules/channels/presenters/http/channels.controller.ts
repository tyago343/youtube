import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from '../../application/services/channels.service';
import { ChannelResponseDto } from './dto/channel-response.dto';
import { Public } from 'src/modules/authentication/presenters/http/decorators/public.decorator';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Public()
  @ApiOperation({
    summary: 'Get all active channels',
    description:
      'Returns all channels with ACTIVE status that are publicly visible.',
  })
  @ApiOkResponse({
    description: 'Active channels fetched successfully',
    type: [ChannelResponseDto],
  })
  @Get()
  async getActiveChannels(): Promise<ChannelResponseDto[]> {
    const channels = await this.channelsService.getActiveChannels();
    return channels.map((channel) => ChannelResponseDto.fromDomain(channel));
  }
}
