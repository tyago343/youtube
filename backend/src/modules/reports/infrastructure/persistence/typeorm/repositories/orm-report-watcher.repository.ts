import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportId } from 'src/modules/reports/domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ReportWatcherRepository } from 'src/modules/reports/application/ports/report-watcher.repository';
import { ReportWatcherSchema } from '../entities/report-watcher.schema';

@Injectable()
export class OrmReportWatcherRepository implements ReportWatcherRepository {
  constructor(
    @InjectRepository(ReportWatcherSchema)
    private readonly repository: Repository<ReportWatcherSchema>,
  ) {}

  async addWatcher(reportId: ReportId, userId: UserId): Promise<void> {
    const existing = await this.repository.findOne({
      where: { reportId: reportId.value, userId: userId.value },
    });

    if (!existing) {
      const watcher = new ReportWatcherSchema();
      watcher.reportId = reportId.value;
      watcher.userId = userId.value;
      await this.repository.save(watcher);
    }
  }

  async removeWatcher(reportId: ReportId, userId: UserId): Promise<void> {
    await this.repository.delete({
      reportId: reportId.value,
      userId: userId.value,
    });
  }

  async findWatchers(reportId: ReportId): Promise<UserId[]> {
    const watchers = await this.repository.find({
      where: { reportId: reportId.value },
    });

    return watchers.map((w) => UserId.create(w.userId));
  }

  async findWatchedReports(userId: UserId): Promise<ReportId[]> {
    const watched = await this.repository.find({
      where: { userId: userId.value },
    });

    return watched.map((w) => ReportId.create(w.reportId));
  }

  async isWatching(reportId: ReportId, userId: UserId): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { reportId: reportId.value, userId: userId.value },
    });

    return existing !== null;
  }
}
