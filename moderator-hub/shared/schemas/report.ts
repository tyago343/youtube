import * as z from "zod";

const reportableType = z.enum([
  "VIDEO",
  "CHANNEL",
  "COMMENT",
  "PLAYLIST",
  "USER",
]);
const severity = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const status = z.enum([
  "PENDING",
  "ASSIGNED",
  "IN_REVIEW",
  "ESCALATED_TO_LEGAL",
  "RESOLVED",
  "DISMISSED",
]);

export const reportSchema = z.object({
  id: z.string(),
  reporterUserId: z.string(),
  reportableType,
  reportableId: z.string(),
  reason: z.string(),
  severity,
  status,
  assignedToUserId: z.string().nullable(),
  escalatedToLegalAt: z.string().nullable(),
  rejectedEscalationAt: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const reportsResponseSchema = z.array(reportSchema);

export type ReportSchema = z.infer<typeof reportSchema>;
