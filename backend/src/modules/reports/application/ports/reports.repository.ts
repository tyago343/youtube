import { Report } from '../../domain/report.entity';
import { ReportId } from '../../domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export abstract class ReportsRepository {
  abstract findAll(): Promise<Report[]>;
  abstract save(report: Report): Promise<void>;
  abstract findById(id: ReportId): Promise<Report | null>;
  abstract findByReporter(reporterUserId: UserId): Promise<Report[]>;
  abstract findByAssignee(assignedToUserId: UserId): Promise<Report[]>;
  abstract findPending(): Promise<Report[]>;
  abstract findOpen(): Promise<Report[]>;
  abstract findByReportable(
    reportableType: string,
    reportableId: string,
  ): Promise<Report[]>;
  abstract delete(id: ReportId): Promise<void>;
}
