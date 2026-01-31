import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull, Or } from 'typeorm';
import { Sanction } from 'src/modules/sanctions/domain/sanction.entity';
import { SanctionId } from 'src/modules/sanctions/domain/vo/sanction-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { SanctionRepository } from 'src/modules/sanctions/application/ports/sanction.repository';
import { SanctionSchema } from '../entities/sanction.schema';
import { SanctionReportSchema } from '../entities/sanction-report.schema';
import { SanctionMapper } from '../mappers/sanction.mapper';

@Injectable()
export class OrmSanctionRepository implements SanctionRepository {
  constructor(
    @InjectRepository(SanctionSchema)
    private readonly sanctionRepository: Repository<SanctionSchema>,
    @InjectRepository(SanctionReportSchema)
    private readonly sanctionReportRepository: Repository<SanctionReportSchema>,
  ) {}

  async save(sanction: Sanction): Promise<void> {
    const schema = SanctionMapper.toPersistence(sanction);
    await this.sanctionRepository.save(schema);

    const primitives = sanction.toPrimitives();
    await this.sanctionReportRepository.delete({ sanctionId: primitives.id });

    const reportLinks = primitives.reportIds.map((reportId) => {
      const link = new SanctionReportSchema();
      link.sanctionId = primitives.id;
      link.reportId = reportId;
      return link;
    });

    if (reportLinks.length > 0) {
      await this.sanctionReportRepository.save(reportLinks);
    }
  }

  async findById(id: SanctionId): Promise<Sanction | null> {
    const schema = await this.sanctionRepository.findOne({
      where: { id: id.value },
    });

    if (!schema) {
      return null;
    }

    const reportIds = await this.getReportIds(id.value);
    return SanctionMapper.toDomain(schema, reportIds);
  }

  async findByTarget(
    targetType: string,
    targetId: string,
  ): Promise<Sanction[]> {
    const schemas = await this.sanctionRepository.find({
      where: { targetType, targetId },
      order: { appliedAt: 'DESC' },
    });

    return this.mapSchemasWithReports(schemas);
  }

  async findByAppliedBy(userId: UserId): Promise<Sanction[]> {
    const schemas = await this.sanctionRepository.find({
      where: { appliedByUserId: userId.value },
      order: { appliedAt: 'DESC' },
    });

    return this.mapSchemasWithReports(schemas);
  }

  async findActiveByTarget(
    targetType: string,
    targetId: string,
  ): Promise<Sanction[]> {
    const now = new Date();
    const schemas = await this.sanctionRepository.find({
      where: {
        targetType,
        targetId,
        expiresAt: Or(IsNull(), MoreThan(now)),
      },
      order: { appliedAt: 'DESC' },
    });

    return this.mapSchemasWithReports(schemas);
  }

  async findByReportId(reportId: string): Promise<Sanction[]> {
    const links = await this.sanctionReportRepository.find({
      where: { reportId },
    });

    const sanctionIds = links.map((l) => l.sanctionId);
    if (sanctionIds.length === 0) {
      return [];
    }

    const schemas = await this.sanctionRepository
      .createQueryBuilder('sanction')
      .where('sanction.id IN (:...ids)', { ids: sanctionIds })
      .orderBy('sanction.appliedAt', 'DESC')
      .getMany();

    return this.mapSchemasWithReports(schemas);
  }

  async delete(id: SanctionId): Promise<void> {
    await this.sanctionReportRepository.delete({ sanctionId: id.value });
    await this.sanctionRepository.delete({ id: id.value });
  }

  private async getReportIds(sanctionId: string): Promise<string[]> {
    const links = await this.sanctionReportRepository.find({
      where: { sanctionId },
    });
    return links.map((l) => l.reportId);
  }

  private async mapSchemasWithReports(
    schemas: SanctionSchema[],
  ): Promise<Sanction[]> {
    const result: Sanction[] = [];

    for (const schema of schemas) {
      const reportIds = await this.getReportIds(schema.id);
      result.push(SanctionMapper.toDomain(schema, reportIds));
    }

    return result;
  }
}
