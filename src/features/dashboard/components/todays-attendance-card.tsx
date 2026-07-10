import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TodaysAttendanceCardProps {
  totalActive: number;
  tiffinsToday: number;
  tiffinsThisMonth: number;
}

export function TodaysAttendanceCard({ totalActive, tiffinsToday, tiffinsThisMonth }: TodaysAttendanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s attendance</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/attendance" />} nativeButton={false}>
            View
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{tiffinsToday}</p>
            <p className="text-xs text-muted-foreground">Tiffins today</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{tiffinsThisMonth}</p>
            <p className="text-xs text-muted-foreground">Tiffins this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
