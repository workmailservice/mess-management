import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealType } from "@/generated/prisma";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

interface MealSummaryCardsProps {
  totalActive: number;
  skippedCounts: Record<MealType, number>;
}

export function MealSummaryCards({ totalActive, skippedCounts }: MealSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(Object.keys(MEAL_LABELS) as MealType[]).map((mealType) => {
        const skipped = skippedCounts[mealType] ?? 0;
        const taking = totalActive - skipped;
        return (
          <Card key={mealType}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{MEAL_LABELS[mealType]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {taking}
                <span className="text-base font-normal text-muted-foreground"> / {totalActive}</span>
              </p>
              <p className="text-xs text-muted-foreground">{skipped} skipped</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
