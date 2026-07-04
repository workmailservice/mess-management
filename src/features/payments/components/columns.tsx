"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface PaymentRow {
  id: string;
  amount: string;
  method: string;
  transactionRef: string | null;
  paidAt: string;
  customer: { id: string; name: string; phone: string };
  invoice: { id: string; month: number; year: number } | null;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const paymentColumns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "customer.name",
    id: "customerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => row.original.customer.name,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => <Badge variant="outline">{row.original.method.replace("_", " ")}</Badge>,
  },
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) =>
      row.original.invoice ? (
        <span className="text-muted-foreground">
          {MONTH_NAMES[row.original.invoice.month - 1]} {row.original.invoice.year}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => new Date(row.original.paidAt).toLocaleDateString("en-IN", { timeZone: "UTC" }),
  },
];
