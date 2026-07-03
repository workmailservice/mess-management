import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersView } from "@/features/users/components/users-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function UsersPage() {
  if (!(await hasPermission(PERMISSIONS.users.view))) {
    redirect("/dashboard");
  }
  const canManageRoles = await hasPermission(PERMISSIONS.roles.manage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Manage staff and student accounts, roles, and access.</p>
        </div>
        {canManageRoles && (
          <Button variant="outline" nativeButton={false} render={<Link href="/users/roles" />}>
            <ShieldCheck className="size-4" />
            Roles & Permissions
          </Button>
        )}
      </div>
      <UsersView />
    </div>
  );
}
