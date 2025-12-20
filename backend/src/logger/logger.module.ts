import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'SYS:dd/mm/yyyy HH:MM:ss.l',
                    ignore: 'pid,hostname',
                    singleLine: false,
                  },
                },
            customProps: () => ({
              context: 'HTTP',
            }),
            autoLogging: {
              ignore: (req) => {
                // Ignorar health checks para no saturar logs
                return req.url === '/health' || req.url === '/metrics';
              },
            },
            serializers: {
              req: (req) => ({
                id: (req as { id: string }).id,
                method: (req as { method: string }).method,
                url: (req as { url: string }).url,
                headers: {
                  host: (req as { headers: { host: string } }).headers.host,
                  'user-agent': (req as { headers: { 'user-agent': string } })
                    .headers['user-agent'],
                },
                remoteAddress: (req as { remoteAddress: string }).remoteAddress,
                remotePort: (req as { remotePort: number }).remotePort,
              }),
              res: (res) => ({
                statusCode: (res as { statusCode: number }).statusCode,
              }),
              err: (err) => ({
                type: (err as { type: string }).type,
                message: (err as { message: string }).message,
                stack: (err as { stack: string }).stack,
              }),
            },
            // Redactar datos sensibles automáticamente
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.oldPassword',
                'req.body.newPassword',
                'req.body.confirmPassword',
              ],
              censor: '***REDACTED***',
            },
          },
        };
      },
    }),
  ],
  exports: [LoggerService],
  providers: [LoggerService],
})
export class LoggerModule {}
