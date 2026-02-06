import { DynamicModule, Module, Type } from '@nestjs/common';
import { VideoRemovalSanctionUseCase } from './use-cases/video-removal-sanction.use-case';

const useCases = [VideoRemovalSanctionUseCase];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class SanctionsApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: SanctionsApplicationModule,
      imports: [infrastructureModule],
      providers: [...useCases],
      exports: [...useCases],
    };
  }
}
