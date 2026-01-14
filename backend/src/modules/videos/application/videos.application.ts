import { DynamicModule, Module, Type } from '@nestjs/common';
// Use Cases
import { CreateVideoUseCase } from './use-cases/create-video.use-case';
import { GetAllVideosUseCase } from './use-cases/get-all-videos.use-case';
import { GetVideoUseCase } from './use-cases/get-video.use-case';
import { GetAllVideosWithChannelUseCase } from './use-cases/get-all-videos-with-owner.use-case';
import { GetVideoWithChannelUseCase } from './use-cases/get-video-with-owner.use-case';
// Services
import { VideosService } from './services/videos.service';
// Domain
import { VideoFactory } from '../domain/factories/video.factory';
// Infrastructure
import { SharedModule } from 'src/modules/shared/shared.module';
import { ChannelsModule } from 'src/modules/channels/channels.module';

const useCases = [
  CreateVideoUseCase,
  GetAllVideosUseCase,
  GetVideoUseCase,
  GetAllVideosWithChannelUseCase,
  GetVideoWithChannelUseCase,
];

@Module({
  providers: [...useCases, VideosService, VideoFactory],
  exports: [...useCases, VideosService],
})
export class VideosApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: VideosApplicationModule,
      imports: [infrastructureModule, SharedModule, ChannelsModule],
      providers: [...useCases, VideosService, VideoFactory],
      exports: [...useCases, VideosService],
    };
  }
}
