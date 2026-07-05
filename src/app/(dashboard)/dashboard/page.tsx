import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/permissions";
import { getDashboardData } from "@/features/dashboard/services/dashboard-service";
import { StatCards } from "@/features/dashboard/components/stat-cards";
import { TodaysAttendanceCard } from "@/features/dashboard/components/todays-attendance-card";
import { RecentPaymentsCard } from "@/features/dashboard/components/recent-payments-card";
import { RecentExpensesCard } from "@/features/dashboard/components/recent-expenses-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { MonthlyTrendChart } from "@/features/reports/components/monthly-trend-chart";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [session, data] = await Promise.all([getCurrentSession(), getDashboardData()]);

  const statItems = [
    data.activeCustomers !== null && { label: "Active customers", value: String(data.activeCustomers) },
    data.monthlyRevenue !== null && { label: "Revenue this month", value: formatCurrency(data.monthlyRevenue), tone: "success" as const },
    data.monthlyExpenses !== null && { label: "Expenses this month", value: formatCurrency(data.monthlyExpenses) },
    data.outstandingBalance !== null && { label: "Outstanding balance", value: formatCurrency(data.outstandingBalance), tone: data.outstandingBalance > 0 ? ("destructive" as const) : undefined },
  ].filter((item): item is { label: string; value: string; tone?: "success" | "destructive" } => !!item);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {session?.user.name}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your mess today.</p>
      </div>

      <QuickActions />

      <StatCards items={statItems} />

      <div className="grid gap-4 lg:grid-cols-3">
        {data.todaysAttendance && (
          <TodaysAttendanceCard totalActive={data.todaysAttendance.totalActive} skippedCounts={data.todaysAttendance.skippedCounts} />
        )}

        {data.trend && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue vs expenses — last 6 months</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={data.trend} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {data.recentPayments && <RecentPaymentsCard payments={data.recentPayments} />}
        {data.recentExpenses && <RecentExpensesCard expenses={data.recentExpenses} />}
        {data.recentActivity && <RecentActivityCard activity={data.recentActivity} />}
      </div>
    </div>
  );
}
