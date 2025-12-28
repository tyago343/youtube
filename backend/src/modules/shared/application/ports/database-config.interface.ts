export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  autoLoadEntities?: boolean;
  ssl?: boolean;
  extra?: Record<string, any>;
}

export abstract class DatabaseConfigService {
  abstract getConfig(): DatabaseConfig;
}
