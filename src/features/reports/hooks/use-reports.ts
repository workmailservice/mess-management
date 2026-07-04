"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfitAndLossAction, getMonthlyTrendAction } from "@/features/reports/actions";

export function useProfitAndLoss(month: number, year: number) {
  return useQuery({ queryKey: ["profit-loss", year, month], queryFn: () => getProfitAndLossAction(month, year) });
}

export function useMonthlyTrend(monthsBack: number, endMonth: number, endYear: number) {
  return useQuery({
    queryKey: ["monthly-trend", endYear, endMonth, monthsBack],
    queryFn: () => getMonthlyTrendAction(monthsBack, endMonth, endYear),
  });
}
