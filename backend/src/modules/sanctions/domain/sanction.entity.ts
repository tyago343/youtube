import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { InvalidSanctionTargetException } from './exceptions/invalid-sanction-target.exception';
import { SanctionId } from './vo/sanction-id.vo';
import { SanctionTargetType } from './vo/sanction-target-type.vo';
import { SanctionType } from './vo/sanction-type.vo';

export class Sanction {
  private constructor({
    id,
    reportIds,
    sanctionType,
    targetType,
    targetId,
    messageBody,
    appliedByUserId,
    appliedAt,
    expiresAt,
  }: {
    id: SanctionId;
    reportIds: string[];
    sanctionType: SanctionType;
    targetType: SanctionTargetType | null;
    targetId: string | null;
    messageBody: string;
    appliedByUserId: UserId;
    appliedAt: Date;
    expiresAt: Date | null;
  }) {
    this.id = id;
    this.reportIds = reportIds;
    this.sanctionType = sanctionType;
    this.targetType = targetType;
    this.targetId = targetId;
    this.messageBody = messageBody;
    this.appliedByUserId = appliedByUserId;
    this.appliedAt = appliedAt;
    this.expiresAt = expiresAt;
  }

  public readonly id: SanctionId;
  public readonly reportIds: readonly string[];
  public readonly sanctionType: SanctionType;
  public readonly targetType: SanctionTargetType | null;
  public readonly targetId: string | null;
  public readonly messageBody: string;
  public readonly appliedByUserId: UserId;
  public readonly appliedAt: Date;
  public readonly expiresAt: Date | null;

  static create({
    id,
    reportIds,
    sanctionType,
    targetType,
    targetId,
    messageBody,
    appliedByUserId,
    expiresAt = null,
  }: {
    id: string;
    reportIds: string[];
    sanctionType: SanctionType;
    targetType: SanctionTargetType | null;
    targetId: string | null;
    messageBody: string;
    appliedByUserId: UserId;
    expiresAt?: Date | null;
  }): Sanction {
    Sanction.validateReportIds(reportIds);
    Sanction.validateTargetForType(sanctionType, targetType, targetId);

    return new Sanction({
      id: SanctionId.create(id),
      reportIds: [...reportIds],
      sanctionType,
      targetType,
      targetId,
      messageBody,
      appliedByUserId,
      appliedAt: new Date(),
      expiresAt,
    });
  }

  static fromPersistence({
    id,
    reportIds,
    sanctionType,
    targetType,
    targetId,
    messageBody,
    appliedByUserId,
    appliedAt,
    expiresAt,
  }: {
    id: string;
    reportIds: string[];
    sanctionType: string;
    targetType: string | null;
    targetId: string | null;
    messageBody: string;
    appliedByUserId: string;
    appliedAt: Date;
    expiresAt: Date | null;
  }): Sanction {
    Sanction.validateReportIds(reportIds);
    const type = SanctionType.fromString(sanctionType);
    const resolvedTargetType =
      targetType !== null ? SanctionTargetType.fromString(targetType) : null;
    Sanction.validateTargetForType(type, resolvedTargetType, targetId);

    return new Sanction({
      id: SanctionId.create(id),
      reportIds: [...reportIds],
      sanctionType: type,
      targetType: resolvedTargetType,
      targetId,
      messageBody,
      appliedByUserId: UserId.create(appliedByUserId),
      appliedAt,
      expiresAt,
    });
  }

  private static validateReportIds(reportIds: string[]): void {
    if (!reportIds || reportIds.length === 0) {
      throw new InvalidSanctionTargetException(
        'Sanction must have at least one report',
      );
    }
  }

  private static validateTargetForType(
    sanctionType: SanctionType,
    targetType: SanctionTargetType | null,
    targetId: string | null,
  ): void {
    if (sanctionType.equals(SanctionType.DISMISSED)) {
      if (targetType !== null || targetId !== null) {
        throw new InvalidSanctionTargetException(
          'DISMISSED sanction must not have targetType or targetId',
        );
      }
    } else {
      if (targetType === null || targetId === null || targetId.trim() === '') {
        throw new InvalidSanctionTargetException(
          `Sanction type ${sanctionType.value} requires targetType and targetId`,
        );
      }
    }
  }

  isExpired(): boolean {
    if (this.expiresAt === null) {
      return false;
    }
    return new Date() >= this.expiresAt;
  }

  isTemporary(): boolean {
    return this.sanctionType.isTemporary();
  }

  isDismissed(): boolean {
    return this.sanctionType.equals(SanctionType.DISMISSED);
  }

  hasReport(reportId: string): boolean {
    return this.reportIds.includes(reportId);
  }

  toPrimitives(): {
    id: string;
    reportIds: string[];
    sanctionType: string;
    targetType: string | null;
    targetId: string | null;
    messageBody: string;
    appliedByUserId: string;
    appliedAt: Date;
    expiresAt: Date | null;
  } {
    return {
      id: this.id.value,
      reportIds: [...this.reportIds],
      sanctionType: this.sanctionType.value,
      targetType: this.targetType?.value ?? null,
      targetId: this.targetId,
      messageBody: this.messageBody,
      appliedByUserId: this.appliedByUserId.value,
      appliedAt: this.appliedAt,
      expiresAt: this.expiresAt,
    };
  }
}
