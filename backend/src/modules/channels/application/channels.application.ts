import { DynamicModule, Module, Type } from '@nestjs/common';
// Domain
import { ChannelFactory } from '../domain/factories/channel.factory';
// Use Cases
import { GetActiveChannelsUseCase } from './use-cases/get-active-channels.use-case';
import { SuspendChannelUseCase } from './use-cases/suspend-channel.use-case';
import { ReactivateChannelUseCase } from './use-cases/reactivate-channel.use-case';
import { ProcessExpiredSuspensionsUseCase } from './use-cases/process-expired-suspensions.use-case';
import { GetChannelStatusHistoryUseCase } from './use-cases/get-channel-status-history.use-case';
// Services
import { ChannelsService } from './services/channels.service';
import { CreateChannelUseCase } from './use-cases/create-channel.use-case';

const useCases = [
  CreateChannelUseCase,
  GetActiveChannelsUseCase,
  SuspendChannelUseCase,
  ReactivateChannelUseCase,
  ProcessExpiredSuspensionsUseCase,
  GetChannelStatusHistoryUseCase,
];

@Module({
  providers: [ChannelFactory, ...useCases, ChannelsService],
  exports: [ChannelFactory, ...useCases, ChannelsService],
})
export class ChannelsApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: ChannelsApplicationModule,
      imports: [infrastructureModule],
      providers: [ChannelFactory, ...useCases, ChannelsService],
      exports: [ChannelFactory, ...useCases, ChannelsService],
    };
  }
}
