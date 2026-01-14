import { DynamicModule, Module, Type } from '@nestjs/common';
// Domain
import { ChannelFactory } from '../domain/factories/channel.factory';

@Module({
  providers: [ChannelFactory],
  exports: [ChannelFactory],
})
export class ChannelsApplicationModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: ChannelsApplicationModule,
      imports: [infrastructureModule],
      providers: [ChannelFactory],
      exports: [ChannelFactory],
    };
  }
}
