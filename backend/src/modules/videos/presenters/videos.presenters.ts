import { Module } from '@nestjs/common';
import { VideosApplicationModule } from '../application/videos.application';
import { VideosInfrastructureModule } from '../infrastructure/videos.infrastructure';
import { VideosController } from './http/videos.controller';

@Module({
  imports: [
    VideosApplicationModule.withInfrastructure(VideosInfrastructureModule),
  ],
  controllers: [VideosController],
})
export class VideosPresentersModule {}
