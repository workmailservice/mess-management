import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface RecentPayment {
  id: string;
  amount: string;
  customerName: string;
  paidAt: string;
}

export function RecentPaymentsCard({ payments }: { payments: RecentPayment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent payments</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/payments" />} nativeButton={false}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyState icon={Wallet} title="No payments yet" className="border-none py-6" />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{payment.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.paidAt).toLocaleDateString("en-IN", { timeZone: "UTC" })}
                  </p>
                </div>
                <span className="font-medium text-success">{formatCurrency(payment.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
