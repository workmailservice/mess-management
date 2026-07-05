import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

interface RecentExpense {
  id: string;
  amount: string;
  categoryName: string;
  date: string;
}

export function RecentExpensesCard({ expenses }: { expenses: RecentExpense[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent expenses</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/expenses" />} nativeButton={false}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <EmptyState icon={TrendingDown} title="No expenses yet" className="border-none py-6" />
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{expense.categoryName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString("en-IN", { timeZone: "UTC" })}
                  </p>
                </div>
                <span className="font-medium">{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
