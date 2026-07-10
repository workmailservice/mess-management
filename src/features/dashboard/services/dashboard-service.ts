import "server-only";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as dashboardRepo from "@/features/dashboard/repositories/dashboard-repository";
import { getAttendanceForMonth } from "@/features/attendance/services/attendance-service";
import { getProfitAndLoss, getMonthlyTrend } from "@/features/reports/services/report-service";
import { todayDateString, todayMonth } from "@/lib/date";

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

  const { year, month } = todayMonth();
  const today = todayDateString();

  const [activeCustomers, attendanceThisMonth, recentPayments, recentExpenses, profitLoss, trend, outstandingBalance, recentActivity] =
    await Promise.all([
      canViewCustomers ? dashboardRepo.countActiveCustomers() : null,
      canViewAttendance ? getAttendanceForMonth(year, month) : null,
      canViewPayments ? dashboardRepo.findRecentPayments(5) : null,
      canViewExpenses ? dashboardRepo.findRecentExpenses(5) : null,
      canViewReports ? getProfitAndLoss(month, year) : null,
      canViewReports ? getMonthlyTrend(6, month, year) : null,
      canViewPayments ? dashboardRepo.sumOutstandingBalance() : null,
      canViewAuditLogs ? dashboardRepo.findRecentAuditLogs(8) : null,
    ]);

  const todaysAttendance = attendanceThisMonth
    ? {
        totalActive: attendanceThisMonth.customers.length,
        tiffinsToday: attendanceThisMonth.records
          .filter((record) => record.date === today)
          .reduce((sum, record) => sum + record.count, 0),
        tiffinsThisMonth: attendanceThisMonth.records.reduce((sum, record) => sum + record.count, 0),
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
