"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface InvoiceRow {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: string;
  paid: string;
  balance: string;
  dueDate: string;
  status: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED";
}

const STATUS_VARIANT: Record<InvoiceRow["status"], "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PARTIAL: "secondary",
  PENDING: "outline",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export const invoiceColumns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => formatCurrency(row.original.amount),
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" className="size-8" render={<Link href={`/billing/${row.original.id}`} />} nativeButton={false}>
        <Eye className="size-4" />
      </Button>
    ),
  },
];
