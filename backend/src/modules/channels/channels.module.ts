import { Module } from '@nestjs/common';
import { ChannelsApplicationModule } from './application/channels.application';
import { ChannelsInfrastructureModule } from './infrastructure/channels.infrastructure';
import { ChannelsPresentersModule } from './presenters/channels.presenters';

@Module({
  imports: [
    ChannelsApplicationModule.withInfrastructure(ChannelsInfrastructureModule),
    ChannelsInfrastructureModule,
    ChannelsPresentersModule,
  ],
  exports: [ChannelsApplicationModule, ChannelsInfrastructureModule],
})
export class ChannelsModule {}
