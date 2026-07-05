"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogsAction, getEntityTypesAction } from "@/features/audit-logs/actions";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogsAction(filters),
  });
}

export function useEntityTypes() {
  return useQuery({ queryKey: ["audit-log-entity-types"], queryFn: getEntityTypesAction });
}
