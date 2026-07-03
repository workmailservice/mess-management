import { getCurrentSession } from "@/lib/auth/permissions";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {session?.user.name}</h1>
      <p className="text-sm text-muted-foreground">
        Dashboard statistics, charts, and recent activity land here in a later module.
      </p>
    </div>
  );
}
