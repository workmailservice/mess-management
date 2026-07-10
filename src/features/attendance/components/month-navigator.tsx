"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMonths, formatMonthLabel, todayMonth } from "@/lib/date";

interface MonthNavigatorProps {
  year: number;
  month: number;
  onChange: (period: { year: number; month: number }) => void;
}

export function MonthNavigator({ year, month, onChange }: MonthNavigatorProps) {
  const current = todayMonth();
  const isCurrentMonth = year === current.year && month === current.month;

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onChange(addMonths(year, month, -1))} aria-label="Previous month">
        <ChevronLeft className="size-4" />
      </Button>

      <span className="min-w-40 text-center text-sm font-medium">{formatMonthLabel(year, month)}</span>

      <Button variant="outline" size="icon" onClick={() => onChange(addMonths(year, month, 1))} aria-label="Next month">
        <ChevronRight className="size-4" />
      </Button>

      {!isCurrentMonth && (
        <Button variant="ghost" size="sm" onClick={() => onChange(current)}>
          This month
        </Button>
      )}
    </div>
  );
}
