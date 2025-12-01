import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'opentube',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
