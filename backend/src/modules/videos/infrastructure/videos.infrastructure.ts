import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoSchema } from './persistence/typeorm/entities/video.schema';
import { OrmVideoRepository } from './persistence/typeorm/repositories/orm-video.repository';
import { VideosRepository } from '../application/ports/videos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VideoSchema])],
  providers: [
    {
      provide: VideosRepository,
      useClass: OrmVideoRepository,
    },
  ],
  exports: [VideosRepository],
})
export class VideosInfrastructureModule {}
