import { ApiProperty } from '@nestjs/swagger';
import { Report } from '../../../domain/report.entity';

export class ReportResponseDto {
  @ApiProperty({
    description: 'Report id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User id of the reporter',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  reporterUserId: string;

  @ApiProperty({
    description: 'Type of the reported resource',
    example: 'VIDEO',
    enum: ['VIDEO', 'CHANNEL', 'COMMENT', 'PLAYLIST', 'USER'],
  })
  reportableType: string;

  @ApiProperty({
    description: 'Id of the reported resource',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  reportableId: string;

  @ApiProperty({
    description: 'Reason for the report',
    example: 'Inappropriate content',
  })
  reason: string;

  @ApiProperty({
    description: 'Severity of the report',
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  severity: string;

  @ApiProperty({
    description: 'Current status of the report',
    example: 'PENDING',
    enum: [
      'PENDING',
      'ASSIGNED',
      'IN_REVIEW',
      'ESCALATED_TO_LEGAL',
      'RESOLVED',
      'DISMISSED',
    ],
  })
  status: string;

  @ApiProperty({
    description: 'User id of the assigned moderator',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  assignedToUserId: string | null;

  @ApiProperty({
    description: 'Date when the report was escalated to legal',
    nullable: true,
  })
  escalatedToLegalAt: Date | null;

  @ApiProperty({
    description: 'Date when the escalation was rejected',
    nullable: true,
  })
  rejectedEscalationAt: Date | null;

  @ApiProperty({
    description: 'Date when the report was resolved',
    nullable: true,
  })
  resolvedAt: Date | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    nullable: true,
  })
  updatedAt: Date | null;

  static fromDomain(report: Report): ReportResponseDto {
    const primitives = report.toPrimitives();
    const dto = new ReportResponseDto();
    dto.id = primitives.id;
    dto.reporterUserId = primitives.reporterUserId;
    dto.reportableType = primitives.reportableType;
    dto.reportableId = primitives.reportableId;
    dto.reason = primitives.reason;
    dto.severity = primitives.severity;
    dto.status = primitives.status;
    dto.assignedToUserId = primitives.assignedToUserId;
    dto.escalatedToLegalAt = primitives.escalatedToLegalAt;
    dto.rejectedEscalationAt = primitives.rejectedEscalationAt;
    dto.resolvedAt = primitives.resolvedAt;
    dto.createdAt = primitives.createdAt;
    dto.updatedAt = primitives.updatedAt;
    return dto;
  }
}
