import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/states/empty-state";
import { formatCurrency } from "@/lib/utils";
import { PieChart } from "lucide-react";

interface ExpenseBreakdownProps {
  items: { name: string; amount: number }[];
}

export function ExpenseBreakdown({ items }: ExpenseBreakdownProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const sorted = [...items].sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by category</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState icon={PieChart} title="No expenses this month" className="border-none py-8" />
        ) : (
          <div className="space-y-3">
            {sorted.map((item) => {
              const percent = total > 0 ? Math.round((item.amount / total) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-(--color-chart-1)" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
