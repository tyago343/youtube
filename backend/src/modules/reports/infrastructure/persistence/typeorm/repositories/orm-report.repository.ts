import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/modules/reports/domain/report.entity';
import { ReportId } from 'src/modules/reports/domain/vo/report-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ReportsRepository } from 'src/modules/reports/application/ports/reports.repository';
import { ReportSchema } from '../entities/report.schema';
import { ReportMapper } from '../mappers/report.mapper';

@Injectable()
export class OrmReportRepository implements ReportsRepository {
  constructor(
    @InjectRepository(ReportSchema)
    private readonly repository: Repository<ReportSchema>,
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
