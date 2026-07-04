import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentSettingsForm } from "@/features/settings/components/payment-settings-form";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function SettingsPage() {
  if (!(await hasPermission(PERMISSIONS.settings.manage))) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure business and payment details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment settings</CardTitle>
          <CardDescription>Used on invoice PDFs and QR code payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
