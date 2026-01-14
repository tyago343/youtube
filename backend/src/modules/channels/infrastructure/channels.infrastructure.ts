import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelSchema } from './persistence/typeorm/entities/channel.schema';
import { ChannelStatusChangeSchema } from './persistence/typeorm/entities/channel-status-change.schema';
import { OrmChannelRepository } from './persistence/typeorm/repositories/orm-channel.repository';
import { OrmChannelStatusChangeRepository } from './persistence/typeorm/repositories/orm-channel-status-change.repository';
import { ChannelRepository } from '../application/ports/channel.repository';
import { ChannelStatusChangeRepository } from '../application/ports/channel-status-change.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelSchema, ChannelStatusChangeSchema]),
  ],
  providers: [
    {
      provide: ChannelRepository,
      useClass: OrmChannelRepository,
    },
    {
      provide: ChannelStatusChangeRepository,
      useClass: OrmChannelStatusChangeRepository,
    },
  ],
  exports: [ChannelRepository, ChannelStatusChangeRepository],
})
export class ChannelsInfrastructureModule {}
