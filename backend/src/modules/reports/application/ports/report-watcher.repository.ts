import { ReportId } from '../../domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export interface ReportWatcherRepository {
  addWatcher(reportId: ReportId, userId: UserId): Promise<void>;
  removeWatcher(reportId: ReportId, userId: UserId): Promise<void>;
  findWatchers(reportId: ReportId): Promise<UserId[]>;
  findWatchedReports(userId: UserId): Promise<ReportId[]>;
  isWatching(reportId: ReportId, userId: UserId): Promise<boolean>;
}

export const REPORT_WATCHER_REPOSITORY = Symbol('ReportWatcherRepository');
