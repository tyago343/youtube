import { Report } from '../../domain/report.entity';
import { ReportId } from '../../domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export interface ReportRepository {
  save(report: Report): Promise<void>;
  findById(id: ReportId): Promise<Report | null>;
  findByReporter(reporterUserId: UserId): Promise<Report[]>;
  findByAssignee(assignedToUserId: UserId): Promise<Report[]>;
  findPending(): Promise<Report[]>;
  findOpen(): Promise<Report[]>;
  findByReportable(
    reportableType: string,
    reportableId: string,
  ): Promise<Report[]>;
  delete(id: ReportId): Promise<void>;
}

export const REPORT_REPOSITORY = Symbol('ReportRepository');
