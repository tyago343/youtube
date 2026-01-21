import { DynamicModule, Module, Type } from '@nestjs/common';
import { SendWelcomeEmailUseCase } from './use-cases/send-welcome-email.use-case';
import { UserCreatedHandler } from './handlers/user-created.handler';

const useCases = [SendWelcomeEmailUseCase];
const handlers = [UserCreatedHandler];

@Module({
  providers: [...useCases, ...handlers],
  exports: [...useCases],
})
export class NotificationApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: NotificationApplicationModule,
      imports: [infrastructureModule],
      providers: [...useCases, ...handlers],
      exports: [...useCases],
    };
  }
}
