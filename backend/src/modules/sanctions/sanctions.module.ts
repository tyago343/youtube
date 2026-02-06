import { VideosInfrastructureModule } from 'src/modules/videos/infrastructure/videos.infrastructure';
import { Module } from '@nestjs/common';

@Module({
  imports: [VideosInfrastructureModule],
  exports: [],
})
export class SanctionsModule {}
