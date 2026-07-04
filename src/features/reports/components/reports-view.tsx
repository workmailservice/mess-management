"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthNavigator } from "@/features/billing/components/month-navigator";
import { PLSummaryCards } from "@/features/reports/components/pl-summary-cards";
import { ExpenseBreakdown } from "@/features/reports/components/expense-breakdown";
import { MonthlyTrendChart } from "@/features/reports/components/monthly-trend-chart";
import { useProfitAndLoss, useMonthlyTrend } from "@/features/reports/hooks/use-reports";
import { CardGridSkeleton } from "@/components/states/loading-skeleton";
import { todayDateString } from "@/lib/date";

export function ReportsView() {
  const today = todayDateString();
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [year, setYear] = useState(Number(today.slice(0, 4)));

  const { data: pnl, isLoading: pnlLoading } = useProfitAndLoss(month, year);
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(6, month, year);

  return (
    <div className="space-y-6">
      <MonthNavigator month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />

      {pnlLoading || !pnl ? (
        <CardGridSkeleton count={3} />
      ) : (
        <PLSummaryCards totalRevenue={pnl.totalRevenue} totalExpenses={pnl.totalExpenses} netProfit={pnl.netProfit} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs expenses — last 6 months</CardTitle>
        </CardHeader>
        <CardContent>
          {trendLoading || !trend ? <div className="h-70 animate-pulse rounded-md bg-muted" /> : <MonthlyTrendChart data={trend} />}
        </CardContent>
      </Card>

      {pnl && <ExpenseBreakdown items={pnl.expensesByCategory} />}
    </div>
  );
}
