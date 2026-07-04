import { redirect } from "next/navigation";
import { BillingView } from "@/features/billing/components/billing-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function BillingPage() {
  if (!(await hasPermission(PERMISSIONS.billing.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">Generate monthly invoices and track what&apos;s owed.</p>
      </div>
      <BillingView />
    </div>
  );
}
