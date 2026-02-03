export interface Report {
  id: string;
  reporterUserId: string;
  reportableType: ReportableType;
  reportableId: string;
  reason: string;
  severity: ReportSeverity;
  status: ReportStatus;
  assignedToUserId: string | null;
  escalatedToLegalAt: string | null;
  rejectedEscalationAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export type ReportableType =
  | "VIDEO"
  | "CHANNEL"
  | "COMMENT"
  | "PLAYLIST"
  | "USER";

export type ReportSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ReportStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_REVIEW"
  | "ESCALATED_TO_LEGAL"
  | "RESOLVED"
  | "DISMISSED";
