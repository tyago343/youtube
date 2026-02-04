import { DynamicModule, Module, Type } from '@nestjs/common';
import { GetAllReportsUseCase } from './use-cases/get-all-reports.use-case';
import { GetFullReportUseCase } from './use-cases/get-full-report.use-case';

const useCases = [GetAllReportsUseCase, GetFullReportUseCase];

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
