import { Sanction } from '../../domain/sanction.entity';
import { SanctionId } from '../../domain/vo/sanction-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';

export abstract class SanctionRepository {
  abstract save(sanction: Sanction): Promise<void>;
  abstract findById(id: SanctionId): Promise<Sanction | null>;
  abstract findByTarget(
    targetType: string,
    targetId: string,
  ): Promise<Sanction[]>;
  abstract findByAppliedBy(userId: UserId): Promise<Sanction[]>;
  abstract findActiveByTarget(
    targetType: string,
    targetId: string,
  ): Promise<Sanction[]>;
  abstract findByReportId(reportId: string): Promise<Sanction[]>;
  abstract delete(id: SanctionId): Promise<void>;
}
