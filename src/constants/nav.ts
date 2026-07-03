import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  UserCircle,
  Users,
  CalendarCheck,
  Receipt,
  Wallet,
  TrendingDown,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Settings,
  ScrollText,
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import type { PermissionKey } from "@/constants/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Visible if the user has ANY of these permissions. Omit to always show. */
  permissions?: PermissionKey[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users, permissions: [PERMISSIONS.customers.view] },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck, permissions: [PERMISSIONS.attendance.view] },
  { label: "Billing", href: "/billing", icon: Receipt, permissions: [PERMISSIONS.billing.view] },
  { label: "Payments", href: "/payments", icon: Wallet, permissions: [PERMISSIONS.payments.view] },
  { label: "Expenses", href: "/expenses", icon: TrendingDown, permissions: [PERMISSIONS.expenses.view] },
  { label: "Income", href: "/income", icon: TrendingUp, permissions: [PERMISSIONS.income.view] },
  { label: "Reminders", href: "/reminders", icon: MessageCircle, permissions: [PERMISSIONS.reminders.view] },
  { label: "Reports", href: "/reports", icon: BarChart3, permissions: [PERMISSIONS.reports.view] },
  { label: "Users", href: "/users", icon: UserCircle, permissions: [PERMISSIONS.users.view] },
  { label: "Audit Logs", href: "/audit-logs", icon: ScrollText, permissions: [PERMISSIONS.auditLogs.view] },
  { label: "Settings", href: "/settings", icon: Settings, permissions: [PERMISSIONS.settings.manage] },
];
