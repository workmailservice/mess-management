"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  monthlyRate: string;
  joinDate: string;
  advancePaid: string;
  advancePending: string;
  status: "ACTIVE" | "INACTIVE";
}

export function buildCustomerColumns(
  onEdit: (customer: CustomerRow) => void,
  onDelete: (customer: CustomerRow) => void,
): ColumnDef<CustomerRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email || "—"}</span>,
    },
    {
      accessorKey: "monthlyRate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Rate" />,
      cell: ({ row }) => formatCurrency(row.original.monthlyRate),
    },
    {
      accessorKey: "joinDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Join Date" />,
      cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString("en-IN", { timeZone: "UTC" }),
    },
    {
      accessorKey: "advancePaid",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Advance Paid" />,
      cell: ({ row }) => formatCurrency(row.original.advancePaid),
    },
    {
      accessorKey: "advancePending",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Advance Pending" />,
      cell: ({ row }) => formatCurrency(row.original.advancePending),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.status === "ACTIVE" ? "default" : "secondary"}>{row.original.status}</Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
