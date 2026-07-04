"use server";

import * as reportService from "@/features/reports/services/report-service";

export async function getProfitAndLossAction(month: number, year: number) {
  return reportService.getProfitAndLoss(month, year);
}

export async function getMonthlyTrendAction(monthsBack: number, endMonth: number, endYear: number) {
  return reportService.getMonthlyTrend(monthsBack, endMonth, endYear);
}
