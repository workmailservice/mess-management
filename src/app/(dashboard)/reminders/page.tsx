import { redirect } from "next/navigation";
import { RemindersView } from "@/features/reminders/components/reminders-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function RemindersPage() {
  if (!(await hasPermission(PERMISSIONS.reminders.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Reminders</h1>
        <p className="text-sm text-muted-foreground">
          Send a WhatsApp reminder to customers with an outstanding balance. Opens WhatsApp with the message ready —
          you click Send.
        </p>
      </div>
      <RemindersView />
    </div>
  );
}
