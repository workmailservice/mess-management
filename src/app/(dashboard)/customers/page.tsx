import { redirect } from "next/navigation";
import { CustomersView } from "@/features/customers/components/customers-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function CustomersPage() {
  if (!(await hasPermission(PERMISSIONS.customers.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Manage your customers and their monthly billing rate.</p>
      </div>
      <CustomersView />
    </div>
  );
}
