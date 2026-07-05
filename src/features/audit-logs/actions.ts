"use server";

import * as auditLogService from "@/features/audit-logs/services/audit-log-service";
import { auditLogFiltersSchema } from "@/features/audit-logs/schemas/audit-log-schema";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

export async function getAuditLogsAction(filters: AuditLogFilters) {
  const parsed = auditLogFiltersSchema.safeParse(filters);
  const logs = await auditLogService.listAuditLogs(parsed.success ? parsed.data : {});
  return logs.map((log) => ({ ...log, createdAt: log.createdAt.toISOString() }));
}

export async function getEntityTypesAction() {
  return auditLogService.listEntityTypes();
}
