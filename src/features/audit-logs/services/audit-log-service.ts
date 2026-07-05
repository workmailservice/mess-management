import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as auditLogRepo from "@/features/audit-logs/repositories/audit-log-repository";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

export async function listAuditLogs(filters: AuditLogFilters) {
  await requirePermission(PERMISSIONS.auditLogs.view);
  return auditLogRepo.findManyAuditLogs(filters);
}

export async function listEntityTypes() {
  await requirePermission(PERMISSIONS.auditLogs.view);
  return auditLogRepo.findDistinctEntityTypes();
}
