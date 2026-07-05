"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface ReminderRow {
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  month: number;
  year: number;
  dueDate: string;
  balance: string;
  status: "PENDING" | "PARTIAL" | "OVERDUE";
  lastReminderAt: string | null;
  message: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_VARIANT: Record<ReminderRow["status"], "outline" | "secondary" | "destructive"> = {
  PENDING: "outline",
  PARTIAL: "secondary",
  OVERDUE: "destructive",
};

export function buildReminderColumns(onSend: (row: ReminderRow) => void): ColumnDef<ReminderRow>[] {
  return [
    {
      accessorKey: "customerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    },
    {
      id: "invoice",
      header: "Invoice",
      cell: ({ row }) => `${MONTH_NAMES[row.original.month - 1]} ${row.original.year}`,
    },
    {
      accessorKey: "balance",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
      cell: ({ row }) => formatCurrency(row.original.balance),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString("en-IN", { timeZone: "UTC" }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "lastReminderAt",
      header: "Last reminded",
      cell: ({ row }) =>
        row.original.lastReminderAt ? (
          new Date(row.original.lastReminderAt).toLocaleDateString("en-IN", { timeZone: "UTC" })
        ) : (
          <span className="text-muted-foreground">Never</span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => onSend(row.original)}>
          <Send className="size-3.5" />
          Send via WhatsApp
        </Button>
      ),
    },
  ];
}
