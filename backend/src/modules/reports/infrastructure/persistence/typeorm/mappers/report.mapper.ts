import { Report } from 'src/modules/reports/domain/report.entity';
import { ReportSchema } from '../entities/report.schema';

export class ReportMapper {
  static toPersistence(report: Report): ReportSchema {
    const schema = new ReportSchema();
    const primitives = report.toPrimitives();

    schema.id = primitives.id;
    schema.reporterUserId = primitives.reporterUserId;
    schema.reportableType = primitives.reportableType;
    schema.reportableId = primitives.reportableId;
    schema.reason = primitives.reason;
    schema.severity = primitives.severity;
    schema.status = primitives.status;
    schema.assignedToUserId = primitives.assignedToUserId ?? undefined;
    schema.escalatedToLegalAt = primitives.escalatedToLegalAt ?? undefined;
    schema.rejectedEscalationAt = primitives.rejectedEscalationAt ?? undefined;
    schema.resolvedAt = primitives.resolvedAt ?? undefined;
    schema.createdAt = primitives.createdAt;
    schema.updatedAt = primitives.updatedAt ?? undefined;

    return schema;
  }

  static toDomain(schema: ReportSchema): Report {
    return Report.fromPersistence({
      id: schema.id,
      reporterUserId: schema.reporterUserId,
      reportableType: schema.reportableType,
      reportableId: schema.reportableId,
      reason: schema.reason,
      severity: schema.severity,
      status: schema.status,
      assignedToUserId: schema.assignedToUserId ?? null,
      escalatedToLegalAt: schema.escalatedToLegalAt ?? null,
      rejectedEscalationAt: schema.rejectedEscalationAt ?? null,
      resolvedAt: schema.resolvedAt ?? null,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt ?? null,
    });
  }
}
