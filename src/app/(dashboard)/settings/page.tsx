import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentSettingsForm } from "@/features/settings/components/payment-settings-form";
import { BusinessProfileForm } from "@/features/settings/components/business-profile-form";
import { HomepageImagesForm } from "@/features/settings/components/homepage-images-form";
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
          <CardTitle>Business profile</CardTitle>
          <CardDescription>Shown on your public homepage at rpmess.com.</CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage images</CardTitle>
          <CardDescription>Photos shown on your public homepage at rpmess.com.</CardDescription>
        </CardHeader>
        <CardContent>
          <HomepageImagesForm />
        </CardContent>
      </Card>

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
