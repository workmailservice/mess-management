import "server-only";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as dashboardRepo from "@/features/dashboard/repositories/dashboard-repository";
import { getAttendanceForDate } from "@/features/attendance/services/attendance-service";
import { getProfitAndLoss, getMonthlyTrend } from "@/features/reports/services/report-service";
import { todayDateString } from "@/lib/date";
import type { MealType } from "@/generated/prisma";

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

export async function getDashboardData() {
  const [canViewCustomers, canViewAttendance, canViewPayments, canViewExpenses, canViewReports, canViewAuditLogs] =
    await Promise.all([
      hasPermission(PERMISSIONS.customers.view),
      hasPermission(PERMISSIONS.attendance.view),
      hasPermission(PERMISSIONS.payments.view),
      hasPermission(PERMISSIONS.expenses.view),
      hasPermission(PERMISSIONS.reports.view),
      hasPermission(PERMISSIONS.auditLogs.view),
    ]);

  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  const [activeCustomers, attendanceToday, recentPayments, recentExpenses, profitLoss, trend, outstandingBalance, recentActivity] =
    await Promise.all([
      canViewCustomers ? dashboardRepo.countActiveCustomers() : null,
      canViewAttendance ? getAttendanceForDate(todayDateString()) : null,
      canViewPayments ? dashboardRepo.findRecentPayments(5) : null,
      canViewExpenses ? dashboardRepo.findRecentExpenses(5) : null,
      canViewReports ? getProfitAndLoss(month, year) : null,
      canViewReports ? getMonthlyTrend(6, month, year) : null,
      canViewPayments ? dashboardRepo.sumOutstandingBalance() : null,
      canViewAuditLogs ? dashboardRepo.findRecentAuditLogs(8) : null,
    ]);

  const todaysAttendance = attendanceToday
    ? {
        totalActive: attendanceToday.customers.length,
        skippedCounts: MEAL_TYPES.reduce(
          (acc, mealType) => {
            acc[mealType] = attendanceToday.records.filter((r) => r.mealType === mealType && r.status === "SKIPPED").length;
            return acc;
          },
          { BREAKFAST: 0, LUNCH: 0, DINNER: 0 } as Record<MealType, number>,
        ),
      }
    : null;

  return {
    activeCustomers,
    todaysAttendance,
    outstandingBalance,
    monthlyRevenue: profitLoss?.totalRevenue ?? null,
    monthlyExpenses: profitLoss?.totalExpenses ?? null,
    monthlyNetProfit: profitLoss?.netProfit ?? null,
    trend,
    recentPayments: recentPayments?.map((payment) => ({
      id: payment.id,
      amount: payment.amount.toString(),
      customerName: payment.customer.name,
      paidAt: payment.paidAt.toISOString(),
    })) ?? null,
    recentExpenses: recentExpenses?.map((expense) => ({
      id: expense.id,
      amount: expense.amount.toString(),
      categoryName: expense.category.name,
      date: expense.date.toISOString(),
    })) ?? null,
    recentActivity: recentActivity?.map((log) => ({ ...log, createdAt: log.createdAt.toISOString() })) ?? null,
  };
}
