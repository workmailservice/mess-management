import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as reportRepo from "@/features/reports/repositories/report-repository";

/**
 * Cash-basis P&L: revenue counted when a payment is actually received (not when
 * an invoice is issued), which is what a small business owner means by "money in."
 */
export async function getProfitAndLoss(month: number, year: number) {
  await requirePermission(PERMISSIONS.reports.view);

  const [customerPayments, otherIncome, totalExpenses, expensesByCategory] = await Promise.all([
    reportRepo.sumPaymentsForMonth(month, year),
    reportRepo.sumIncomeForMonth(month, year),
    reportRepo.sumExpensesForMonth(month, year),
    reportRepo.expensesByCategoryForMonth(month, year),
  ]);

  const totalRevenue = customerPayments + otherIncome;

  return {
    month,
    year,
    customerPayments,
    otherIncome,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    expensesByCategory,
  };
}

export async function getMonthlyTrend(monthsBack: number, endMonth: number, endYear: number) {
  await requirePermission(PERMISSIONS.reports.view);

  const points: { label: string; month: number; year: number; revenue: number; expenses: number; profit: number }[] = [];
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = monthsBack - 1; i >= 0; i--) {
    let month = endMonth - i;
    let year = endYear;
    while (month < 1) {
      month += 12;
      year -= 1;
    }

    const [payments, otherIncome, expenses] = await Promise.all([
      reportRepo.sumPaymentsForMonth(month, year),
      reportRepo.sumIncomeForMonth(month, year),
      reportRepo.sumExpensesForMonth(month, year),
    ]);

    const revenue = payments + otherIncome;
    points.push({ label: `${MONTH_NAMES[month - 1]} ${year}`, month, year, revenue, expenses, profit: revenue - expenses });
  }

  return points;
}
