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

const channelSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable().optional(),
});

const videoReportableItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
  createdAt: z.string(),
  views: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  channel: channelSummarySchema,
  updatedAt: z.string().nullable().optional(),
  published: z.string().nullable().optional(),
});

const channelReportableItemSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  avatarUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  isMonetizationEnabled: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export const reportableItemSchema = z.union([
  videoReportableItemSchema,
  channelReportableItemSchema,
]);

export const fullReportResponseSchema = z.object({
  report: reportSchema,
  reportableItem: reportableItemSchema.nullable(),
});

export type ReportSchema = z.infer<typeof reportSchema>;
export type Report = ReportSchema;
export type ReportableType = z.infer<typeof reportableType>;
export type ReportSeverity = z.infer<typeof severity>;
export type ReportStatus = z.infer<typeof status>;
export type ChannelSummary = z.infer<typeof channelSummarySchema>;
export type VideoReportableItem = z.infer<typeof videoReportableItemSchema>;
export type ChannelReportableItem = z.infer<typeof channelReportableItemSchema>;
export type ReportableItem = z.infer<typeof reportableItemSchema>;
export type FullReportResponse = z.infer<typeof fullReportResponseSchema>;
