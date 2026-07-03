import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { getCurrentSession } from "@/lib/auth/permissions";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal details and password.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>{session.user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultValues={{ name: session.user.name, phone: session.user.phone ?? "" }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>You&apos;ll be signed out of other devices after changing it.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
