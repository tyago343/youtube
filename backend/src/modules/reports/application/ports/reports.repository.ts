import { Channel } from 'src/modules/channels/domain/channel.entity';
import { Report } from '../../domain/report.entity';
import { ReportId } from '../../domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { VideoWithChannel } from 'src/modules/videos/application/ports/videos.repository';

export type ReportableItem = VideoWithChannel | Channel | null;

export type FullReport = {
  report: Report;
  reportableItem: ReportableItem;
};

export abstract class ReportsRepository {
  abstract findAll(): Promise<Report[]>;
  abstract save(report: Report): Promise<void>;
  abstract findById(id: ReportId): Promise<Report | null>;
  abstract findByIdWithReportable(id: ReportId): Promise<FullReport | null>;
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
