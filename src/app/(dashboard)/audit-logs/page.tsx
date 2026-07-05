import { redirect } from "next/navigation";
import { AuditLogsView } from "@/features/audit-logs/components/audit-logs-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function AuditLogsPage() {
  if (!(await hasPermission(PERMISSIONS.auditLogs.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">A record of who did what, for accountability and troubleshooting.</p>
      </div>
      <AuditLogsView />
    </div>
  );
}
