import { DynamicModule, Module, Type } from '@nestjs/common';
import { GetAllReportsUseCase } from './use-cases/get-all-reports.use-case';

const useCases = [GetAllReportsUseCase];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class ReportsApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: ReportsApplicationModule,
      imports: [infrastructureModule],
    };
  }
}
