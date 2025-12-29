import { Module } from '@nestjs/common';
import { VideosApplicationModule } from './application/videos.application';
import { VideosInfrastructureModule } from './infrastructure/videos.infrastructure';
import { VideosPresentersModule } from './presenters/videos.presenters';

@Module({
  imports: [
    VideosApplicationModule.withInfrastructure(VideosInfrastructureModule),
    VideosPresentersModule,
  ],
  exports: [VideosApplicationModule],
})
export class VideosModule {}
