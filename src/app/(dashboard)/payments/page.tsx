import { redirect } from "next/navigation";
import { PaymentsView } from "@/features/payments/components/payments-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function PaymentsPage() {
  if (!(await hasPermission(PERMISSIONS.payments.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">All payments received from customers.</p>
      </div>
      <PaymentsView />
    </div>
  );
}
