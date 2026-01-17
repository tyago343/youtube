import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChannelsService } from '../../application/services/channels.service';
import { ChannelResponseDto } from './dto/channel-response.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Public } from 'src/modules/authentication/presenters/http/decorators/public.decorator';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new channel',
    description:
      'Creates a new channel for the authenticated user. Requires valid JWT token.',
  })
  @ApiCreatedResponse({
    description: 'Channel created successfully',
    type: ChannelResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  async create(
    @Body() dto: CreateChannelDto,
    @Request() req: Request & { user: { userId: string } },
  ): Promise<ChannelResponseDto> {
    const channel = await this.channelsService.create({
      ownerId: UserId.create(req.user.userId),
      name: dto.name,
      description: dto.description,
      avatarUrl: dto.avatarUrl,
      bannerUrl: dto.bannerUrl,
      isMonetizationEnabled: dto.isMonetizationEnabled,
    });
    return ChannelResponseDto.fromDomain(channel);
  }

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
