import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentSession, getCurrentUserPermissions } from "@/lib/auth/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware already blocks unauthenticated requests optimistically (cookie check
  // only); this is the real, DB-backed session check for this render.
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const permissions = await getCurrentUserPermissions();

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar permissions={[...permissions]} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
