import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { VideosModule } from './modules/videos/videos.module';
import { JwtAuthGuard } from './modules/authentication/infrastructure/guards/jwt-authentication.guard';
import { DatabaseConfigService } from './modules/shared/application/ports/database-config.interface';
import { DatabaseInfrastructureModule } from './modules/shared/infrastructure/database/database.infrastructure';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
