import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProcessExpiredSuspensionsUseCase } from '../../application/use-cases/process-expired-suspensions.use-case';

// Cron expression: At 12:00 (noon and midnight), Monday through Saturday
// Format: second minute hour day-of-month month day-of-week
// 0 0 0,12 * * 1-6 = At 00:00 and 12:00, Monday(1) through Saturday(6)
const SUSPENSION_CHECK_CRON = '0 0 0,12 * * 1-6';

@Injectable()
export class ChannelSuspensionScheduler {
  private readonly logger = new Logger(ChannelSuspensionScheduler.name);

  constructor(
    private readonly processExpiredSuspensionsUseCase: ProcessExpiredSuspensionsUseCase,
  ) {}

  @Cron(SUSPENSION_CHECK_CRON)
  async handleExpiredSuspensions(): Promise<void> {
    this.logger.log('Processing expired channel suspensions...');

    try {
      const processed = await this.processExpiredSuspensionsUseCase.execute();

      if (processed.length > 0) {
        this.logger.log(
          `Reactivated ${processed.length} channels: ${processed.map((p) => p.channelId).join(', ')}`,
        );
      } else {
        this.logger.log('No expired suspensions to process');
      }
    } catch (error) {
      this.logger.error('Error processing expired suspensions', error);
    }
  }
}
