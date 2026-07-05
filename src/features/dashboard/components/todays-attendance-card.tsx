import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MealType } from "@/generated/prisma";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

interface TodaysAttendanceCardProps {
  totalActive: number;
  skippedCounts: Record<MealType, number>;
}

export function TodaysAttendanceCard({ totalActive, skippedCounts }: TodaysAttendanceCardProps) {
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
          {(Object.keys(MEAL_LABELS) as MealType[]).map((mealType) => {
            const taking = totalActive - skippedCounts[mealType];
            return (
              <div key={mealType}>
                <p className="text-xl font-semibold">
                  {taking}
                  <span className="text-sm font-normal text-muted-foreground">/{totalActive}</span>
                </p>
                <p className="text-xs text-muted-foreground">{MEAL_LABELS[mealType]}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
