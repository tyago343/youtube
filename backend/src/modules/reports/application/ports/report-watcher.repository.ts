import { ReportId } from '../../domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export abstract class ReportWatcherRepository {
  abstract addWatcher(reportId: ReportId, userId: UserId): Promise<void>;
  abstract removeWatcher(reportId: ReportId, userId: UserId): Promise<void>;
  abstract findWatchers(reportId: ReportId): Promise<UserId[]>;
  abstract findWatchedReports(userId: UserId): Promise<ReportId[]>;
  abstract isWatching(reportId: ReportId, userId: UserId): Promise<boolean>;
}
