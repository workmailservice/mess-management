import { redirect } from "next/navigation";
import { ReportsView } from "@/features/reports/components/reports-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function ReportsPage() {
  if (!(await hasPermission(PERMISSIONS.reports.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Profit &amp; loss overview, cash-basis (counts payments received, not invoices issued).</p>
      </div>
      <ReportsView />
    </div>
  );
}
