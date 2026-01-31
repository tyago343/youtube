import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { ReportId } from './vo/report-id.vo';
import { ReportableType } from './vo/reportable-type.vo';
import { ReportSeverity } from './vo/report-severity.vo';
import { ReportStatus } from './vo/report-status.vo';

export class Report {
  private constructor({
    id,
    reporterUserId,
    reportableType,
    reportableId,
    reason,
    severity,
    status,
    assignedToUserId,
    escalatedToLegalAt,
    rejectedEscalationAt,
    resolvedAt,
    createdAt,
    updatedAt,
  }: {
    id: ReportId;
    reporterUserId: UserId;
    reportableType: ReportableType;
    reportableId: string;
    reason: string;
    severity: ReportSeverity;
    status: ReportStatus;
    assignedToUserId: UserId | null;
    escalatedToLegalAt: Date | null;
    rejectedEscalationAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
  }) {
    this.id = id;
    this.reporterUserId = reporterUserId;
    this.reportableType = reportableType;
    this.reportableId = reportableId;
    this.reason = reason;
    this.severity = severity;
    this.status = status;
    this.assignedToUserId = assignedToUserId;
    this.escalatedToLegalAt = escalatedToLegalAt;
    this.rejectedEscalationAt = rejectedEscalationAt;
    this.resolvedAt = resolvedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly id: ReportId;
  public readonly reporterUserId: UserId;
  public readonly reportableType: ReportableType;
  public readonly reportableId: string;
  public reason: string;
  public severity: ReportSeverity;
  public status: ReportStatus;
  public assignedToUserId: UserId | null;
  public escalatedToLegalAt: Date | null;
  public rejectedEscalationAt: Date | null;
  public resolvedAt: Date | null;
  public readonly createdAt: Date;
  public updatedAt: Date | null;

  static create({
    id,
    reporterUserId,
    reportableType,
    reportableId,
    reason,
    severity,
  }: {
    id: string;
    reporterUserId: UserId;
    reportableType: ReportableType;
    reportableId: string;
    reason: string;
    severity: ReportSeverity;
  }): Report {
    return new Report({
      id: ReportId.create(id),
      reporterUserId,
      reportableType,
      reportableId,
      reason,
      severity,
      status: ReportStatus.PENDING,
      assignedToUserId: null,
      escalatedToLegalAt: null,
      rejectedEscalationAt: null,
      resolvedAt: null,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  static fromPersistence({
    id,
    reporterUserId,
    reportableType,
    reportableId,
    reason,
    severity,
    status,
    assignedToUserId,
    escalatedToLegalAt,
    rejectedEscalationAt,
    resolvedAt,
    createdAt,
    updatedAt,
  }: {
    id: string;
    reporterUserId: string;
    reportableType: string;
    reportableId: string;
    reason: string;
    severity: string;
    status: string;
    assignedToUserId: string | null;
    escalatedToLegalAt: Date | null;
    rejectedEscalationAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
  }): Report {
    return new Report({
      id: ReportId.create(id),
      reporterUserId: UserId.create(reporterUserId),
      reportableType: ReportableType.fromString(reportableType),
      reportableId,
      reason,
      severity: ReportSeverity.fromString(severity),
      status: ReportStatus.fromString(status),
      assignedToUserId: assignedToUserId
        ? UserId.create(assignedToUserId)
        : null,
      escalatedToLegalAt,
      rejectedEscalationAt,
      resolvedAt,
      createdAt,
      updatedAt,
    });
  }

  assignTo(userId: UserId): void {
    this.assignedToUserId = userId;
    this.status = ReportStatus.ASSIGNED;
    this.markAsUpdated();
  }

  startReview(): void {
    this.status = ReportStatus.IN_REVIEW;
    this.markAsUpdated();
  }

  escalateToLegal(): void {
    this.status = ReportStatus.ESCALATED_TO_LEGAL;
    this.escalatedToLegalAt = new Date();
    this.markAsUpdated();
  }

  rejectEscalation(): void {
    this.rejectedEscalationAt = new Date();
    this.status = ReportStatus.IN_REVIEW;
    this.markAsUpdated();
  }

  resolve(): void {
    this.status = ReportStatus.RESOLVED;
    this.resolvedAt = new Date();
    this.markAsUpdated();
  }

  dismiss(): void {
    this.status = ReportStatus.DISMISSED;
    this.resolvedAt = new Date();
    this.markAsUpdated();
  }

  updateSeverity(severity: ReportSeverity): void {
    this.severity = severity;
    this.markAsUpdated();
  }

  isOpen(): boolean {
    return this.status.isOpen();
  }

  isClosed(): boolean {
    return this.status.isClosed();
  }

  isEscalated(): boolean {
    return this.status.isEscalated();
  }

  requiresUrgentAttention(): boolean {
    return this.severity.requiresUrgentAttention();
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id.value,
      reporterUserId: this.reporterUserId.value,
      reportableType: this.reportableType.value,
      reportableId: this.reportableId,
      reason: this.reason,
      severity: this.severity.value,
      status: this.status.value,
      assignedToUserId: this.assignedToUserId?.value ?? null,
      escalatedToLegalAt: this.escalatedToLegalAt,
      rejectedEscalationAt: this.rejectedEscalationAt,
      resolvedAt: this.resolvedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
