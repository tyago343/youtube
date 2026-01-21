import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { VideosModule } from './modules/videos/videos.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { NotificationModule } from './modules/notification/notification.module';
import { JwtAuthGuard } from './modules/authentication/infrastructure/guards/jwt-authentication.guard';
import { DatabaseConfigService } from './modules/shared/application/ports/database-config.interface';
import { DatabaseInfrastructureModule } from './modules/shared/infrastructure/database/database.infrastructure';
import { SharedModule } from './modules/shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseInfrastructureModule],
      useFactory: (dbConfig: DatabaseConfigService) => {
        return dbConfig.getConfig() as TypeOrmModuleOptions;
      },
      inject: [DatabaseConfigService],
    }),
    SharedModule,
    UsersModule,
    AuthenticationModule,
    VideosModule,
    ChannelsModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
