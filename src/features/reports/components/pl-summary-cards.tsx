import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

interface PLSummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export function PLSummaryCards({ totalRevenue, totalExpenses, netProfit }: PLSummaryCardsProps) {
  const isProfit = netProfit >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(totalExpenses)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net profit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn("text-2xl font-semibold", isProfit ? "text-success" : "text-destructive")}>
            {formatCurrency(netProfit)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
