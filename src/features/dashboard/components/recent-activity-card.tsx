import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ScrollText } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  userName: string;
  createdAt: string;
}

const ACTION_VERBS: Record<string, string> = {
  CREATE: "created",
  UPDATE: "updated",
  DELETE: "deleted",
  DEACTIVATE: "deactivated",
  REACTIVATE: "reactivated",
  PASSWORD_RESET: "reset the password for",
};

export function RecentActivityCard({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/audit-logs" />} nativeButton={false}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState icon={ScrollText} title="No activity yet" className="border-none py-6" />
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <p>
                  <span className="font-medium">{item.userName}</span>{" "}
                  <span className="text-muted-foreground">
                    {ACTION_VERBS[item.action] ?? item.action.toLowerCase()} {item.entityType}
                  </span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
