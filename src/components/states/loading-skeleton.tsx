import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-full max-w-sm" />
      <div className="rounded-md border">
        <div className="border-b p-3">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="border-b p-3 last:border-b-0">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, col) => (
                <Skeleton key={col} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}
