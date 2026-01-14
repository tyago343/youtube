import { DynamicModule, Module, Type } from '@nestjs/common';
// Use Cases
import { CreateVideoUseCase } from './use-cases/create-video.use-case';
import { GetAllVideosUseCase } from './use-cases/get-all-videos.use-case';
import { GetVideoUseCase } from './use-cases/get-video.use-case';
import { GetVideoWithChannelUseCase } from './use-cases/get-video-with-owner.use-case';
import { GetAllPublicVideosUseCase } from './use-cases/get-all-public-videos.use-case';
import { GetPublicVideoUseCase } from './use-cases/get-public-video.use-case';
import { GetUserVideosUseCase } from './use-cases/get-user-videos.use-case';
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
  GetVideoWithChannelUseCase,
  GetAllPublicVideosUseCase,
  GetPublicVideoUseCase,
  GetUserVideosUseCase,
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
