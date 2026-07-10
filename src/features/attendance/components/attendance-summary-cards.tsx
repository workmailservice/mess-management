import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceSummaryCardsProps {
  totalActive: number;
  totalTiffinsThisMonth: number;
}

export function AttendanceSummaryCards({ totalActive, totalTiffinsThisMonth }: AttendanceSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{totalActive}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tiffins this month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{totalTiffinsThisMonth}</p>
        </CardContent>
      </Card>
    </div>
  );
}
