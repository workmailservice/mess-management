import { redirect } from "next/navigation";
import { IncomeView } from "@/features/income/components/income-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function IncomePage() {
  if (!(await hasPermission(PERMISSIONS.income.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
        <p className="text-sm text-muted-foreground">Income other than customer payments.</p>
      </div>
      <IncomeView />
    </div>
  );
}
