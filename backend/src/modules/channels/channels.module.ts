import { Module } from '@nestjs/common';
import { ChannelsApplicationModule } from './application/channels.application';
import { ChannelsInfrastructureModule } from './infrastructure/channels.infrastructure';

@Module({
  imports: [
    ChannelsApplicationModule.withInfrastructure(ChannelsInfrastructureModule),
    ChannelsInfrastructureModule,
  ],
  exports: [ChannelsApplicationModule, ChannelsInfrastructureModule],
})
export class ChannelsModule {}
