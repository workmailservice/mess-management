import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/states/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-9 w-full max-w-2xl" />
      <CardGridSkeleton count={4} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}
