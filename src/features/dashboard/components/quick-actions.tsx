import Link from "next/link";
import { UserPlus, Wallet, TrendingDown, Receipt, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

const ACTIONS = [
  { label: "Add customer", href: "/customers", icon: UserPlus, permission: PERMISSIONS.customers.create },
  { label: "Record payment", href: "/payments", icon: Wallet, permission: PERMISSIONS.payments.record },
  { label: "Add expense", href: "/expenses", icon: TrendingDown, permission: PERMISSIONS.expenses.create },
  { label: "Generate invoices", href: "/billing", icon: Receipt, permission: PERMISSIONS.billing.generateInvoice },
  { label: "Send reminders", href: "/reminders", icon: MessageCircle, permission: PERMISSIONS.reminders.send },
] as const;

export async function QuickActions() {
  const permissions = await Promise.all(ACTIONS.map((action) => hasPermission(action.permission)));
  const visibleActions = ACTIONS.filter((_, index) => permissions[index]);

  if (visibleActions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleActions.map((action) => (
        <Button key={action.href} variant="outline" render={<Link href={action.href} />} nativeButton={false}>
          <action.icon className="size-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
