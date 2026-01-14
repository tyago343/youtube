import { Module } from '@nestjs/common';
import { ChannelsController } from './http/channels.controller';
import { ChannelsApplicationModule } from '../application/channels.application';
import { ChannelsInfrastructureModule } from '../infrastructure/channels.infrastructure';

@Module({
  imports: [
    ChannelsApplicationModule.withInfrastructure(ChannelsInfrastructureModule),
  ],
  controllers: [ChannelsController],
})
export class ChannelsPresentersModule {}
