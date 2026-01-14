import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { VideosModule } from './modules/videos/videos.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { JwtAuthGuard } from './modules/authentication/infrastructure/guards/jwt-authentication.guard';
import { DatabaseConfigService } from './modules/shared/application/ports/database-config.interface';
import { DatabaseInfrastructureModule } from './modules/shared/infrastructure/database/database.infrastructure';
import { SharedModule } from './modules/shared/shared.module';
// NOTE: Install @nestjs/schedule to enable scheduled tasks
// import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ScheduleModule.forRoot(), // Uncomment after installing @nestjs/schedule
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
