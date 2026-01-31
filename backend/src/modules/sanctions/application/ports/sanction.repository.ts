import { Sanction } from '../../domain/sanction.entity';
import { SanctionId } from '../../domain/vo/sanction-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export interface SanctionRepository {
  save(sanction: Sanction): Promise<void>;
  findById(id: SanctionId): Promise<Sanction | null>;
  findByTarget(targetType: string, targetId: string): Promise<Sanction[]>;
  findByAppliedBy(userId: UserId): Promise<Sanction[]>;
  findActiveByTarget(targetType: string, targetId: string): Promise<Sanction[]>;
  findByReportId(reportId: string): Promise<Sanction[]>;
  delete(id: SanctionId): Promise<void>;
}

export const SANCTION_REPOSITORY = Symbol('SanctionRepository');
