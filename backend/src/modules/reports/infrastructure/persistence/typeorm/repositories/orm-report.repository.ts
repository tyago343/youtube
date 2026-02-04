import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/modules/reports/domain/report.entity';
import { ReportId } from 'src/modules/reports/domain/vo/report-id.vo';
import { ReportableType } from 'src/modules/reports/domain/vo/reportable-type.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import {
  ReportsRepository,
  FullReport,
} from 'src/modules/reports/application/ports/reports.repository';
import { ReportSchema } from '../entities/report.schema';
import { ReportMapper } from '../mappers/report.mapper';
import { VideosRepository } from 'src/modules/videos/application/ports/videos.repository';
import { ChannelRepository } from 'src/modules/channels/application/ports/channel.repository';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';

@Injectable()
export class OrmReportRepository implements ReportsRepository {
  constructor(
    @InjectRepository(ReportSchema)
    private readonly repository: Repository<ReportSchema>,
    private readonly videosRepository: VideosRepository,
    private readonly channelRepository: ChannelRepository,
  ) {}

  async save(report: Report): Promise<void> {
    const schema = ReportMapper.toPersistence(report);
    await this.repository.save(schema);
  }

  async findById(id: ReportId): Promise<Report | null> {
    const schema = await this.repository.findOne({
      where: { id: id.value },
    });

    return schema ? ReportMapper.toDomain(schema) : null;
  }

  async findByIdWithReportable(id: ReportId): Promise<FullReport | null> {
    const report = await this.findById(id);
    if (!report) {
      return null;
    }

    let reportableItem: FullReport['reportableItem'] = null;

    if (report.reportableType.equals(ReportableType.VIDEO)) {
      reportableItem = await this.videosRepository.findByIdWithChannel(
        report.reportableId,
      );
    } else if (report.reportableType.equals(ReportableType.CHANNEL)) {
      reportableItem = await this.channelRepository.findById(
        ChannelId.create(report.reportableId),
      );
    }
    // COMMENT, PLAYLIST, USER: reportableItem stays null

    return { report, reportableItem };
  }

  async findByReporter(reporterUserId: UserId): Promise<Report[]> {
    const schemas = await this.repository.find({
      where: { reporterUserId: reporterUserId.value },
      order: { createdAt: 'DESC' },
    });

    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async findByAssignee(assignedToUserId: UserId): Promise<Report[]> {
    const schemas = await this.repository.find({
      where: { assignedToUserId: assignedToUserId.value },
      order: { createdAt: 'DESC' },
    });

    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async findPending(): Promise<Report[]> {
    const schemas = await this.repository.find({
      where: { status: 'PENDING' },
      order: { createdAt: 'ASC' },
    });

    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async findAll(): Promise<Report[]> {
    const schemas = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async findOpen(): Promise<Report[]> {
    const schemas = await this.repository
      .createQueryBuilder('report')
      .where('report.status IN (:...statuses)', {
        statuses: ['PENDING', 'ASSIGNED', 'IN_REVIEW', 'ESCALATED_TO_LEGAL'],
      })
      .orderBy('report.createdAt', 'ASC')
      .getMany();

    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async findByReportable(
    reportableType: string,
    reportableId: string,
  ): Promise<Report[]> {
    const schemas = await this.repository.find({
      where: { reportableType, reportableId },
      order: { createdAt: 'DESC' },
    });

    return schemas.map((schema) => ReportMapper.toDomain(schema));
  }

  async delete(id: ReportId): Promise<void> {
    await this.repository.delete({ id: id.value });
  }
}
