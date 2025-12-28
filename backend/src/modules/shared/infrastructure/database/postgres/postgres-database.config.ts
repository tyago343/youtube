import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DatabaseConfigService,
  DatabaseConfig,
} from 'src/modules/shared/application/ports/database-config.interface';

@Injectable()
export class PostgresDatabaseConfigService extends DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getConfig(): DatabaseConfig {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get<string>('DB_PORT', '5432'), 10),
      username: this.configService.get<string>('DB_USER', 'admin'),
      password: this.configService.get<string>('DB_PASSWORD', 'root'),
      database: this.configService.get<string>('DB_NAME', 'opentube'),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', true),
      autoLoadEntities: true,
      ssl: this.configService.get<boolean>('DB_SSL', false),
    };
  }
}
