import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RolesView } from "@/features/roles/components/roles-view";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function RolesPage() {
  if (!(await hasPermission(PERMISSIONS.roles.manage))) {
    redirect("/users");
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" nativeButton={false} render={<Link href="/users" />}>
          <ArrowLeft className="size-4" />
          Users
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Manage what each role can access. System roles can have their permissions adjusted but not be renamed or
          deleted.
        </p>
      </div>
      <RolesView />
    </div>
  );
}
