import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelSchema } from './persistence/typeorm/entities/channel.schema';
import { OrmChannelRepository } from './persistence/typeorm/repositories/orm-channel.repository';
import { ChannelRepository } from '../application/ports/channel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelSchema])],
  providers: [
    {
      provide: ChannelRepository,
      useClass: OrmChannelRepository,
    },
  ],
  exports: [ChannelRepository],
})
export class ChannelsInfrastructureModule {}
