"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AuditLogRow } from "@/features/audit-logs/components/columns";

interface AuditLogDetailDialogProps {
  log: AuditLogRow | null;
  onOpenChange: (open: boolean) => void;
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

export function AuditLogDetailDialog({ log, onOpenChange }: AuditLogDetailDialogProps) {
  return (
    <Dialog open={!!log} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {log?.userName} {log?.action.toLowerCase()}d {log?.entityType}
          </DialogTitle>
          <DialogDescription>
            {log && new Date(log.createdAt).toLocaleString("en-IN", { timeZone: "UTC", dateStyle: "full", timeStyle: "medium" })}
            {log?.ipAddress && ` — ${log.ipAddress}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <JsonBlock label="Before" value={log?.changesBefore} />
          <JsonBlock label="After" value={log?.changesAfter} />
          {!log?.changesBefore && !log?.changesAfter && (
            <p className="text-sm text-muted-foreground">No detailed change data recorded for this entry.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
