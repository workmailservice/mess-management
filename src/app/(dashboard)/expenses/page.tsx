import { redirect } from "next/navigation";
import { ExpensesView } from "@/features/expenses/components/expenses-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function ExpensesPage() {
  if (!(await hasPermission(PERMISSIONS.expenses.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <p className="text-sm text-muted-foreground">Track money spent running the mess.</p>
      </div>
      <ExpensesView />
    </div>
  );
}
