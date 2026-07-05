"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useAuditLogs } from "@/features/audit-logs/hooks/use-audit-logs";
import { buildAuditLogColumns, type AuditLogRow } from "@/features/audit-logs/components/columns";
import { AuditLogFiltersBar } from "@/features/audit-logs/components/audit-log-filters";
import { AuditLogDetailDialog } from "@/features/audit-logs/components/audit-log-detail-dialog";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

export function AuditLogsView() {
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const { data, isLoading, isError, refetch } = useAuditLogs(filters);
  const [viewingLog, setViewingLog] = useState<AuditLogRow | null>(null);

  const columns = useMemo(() => buildAuditLogColumns((log) => setViewingLog(log)), []);

  return (
    <div className="space-y-4">
      <AuditLogFiltersBar filters={filters} onChange={setFilters} />

      <DataTable
        columns={columns}
        data={data ?? []}
        searchColumn="userName"
        searchPlaceholder="Search by user..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No activity found"
        emptyDescription="Try adjusting the filters above."
      />

      <p className="text-xs text-muted-foreground">Showing the most recent 500 matching entries.</p>

      <AuditLogDetailDialog log={viewingLog} onOpenChange={(open) => !open && setViewingLog(null)} />
    </div>
  );
}
