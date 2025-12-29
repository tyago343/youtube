import { DynamicModule, Module, Type } from '@nestjs/common';
// Use Cases
import { CreateVideoUseCase } from './use-cases/create-video.use-case';
// Services
import { VideosService } from './services/videos.service';
// Domain
import { VideoFactory } from '../domain/factories/video.factory';
// Infrastructure
import { SharedModule } from 'src/modules/shared/shared.module';
import { UsersModule } from 'src/modules/users/users.module';

const useCases = [CreateVideoUseCase];

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
      imports: [infrastructureModule, SharedModule, UsersModule],
      providers: [...useCases, VideosService, VideoFactory],
      exports: [...useCases, VideosService],
    };
  }
}
