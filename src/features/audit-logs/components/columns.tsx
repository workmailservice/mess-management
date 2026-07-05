"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export interface AuditLogRow {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userName: string;
  createdAt: string;
  changesBefore: unknown;
  changesAfter: unknown;
  ipAddress: string | null;
}

const ACTION_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  DEACTIVATE: "destructive",
  REACTIVATE: "default",
  PASSWORD_RESET: "outline",
};

export function buildAuditLogColumns(onView: (row: AuditLogRow) => void): ColumnDef<AuditLogRow>[] {
  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("en-IN", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }),
    },
    {
      accessorKey: "userName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <Badge variant={ACTION_VARIANT[row.original.action] ?? "outline"}>{row.original.action}</Badge>,
    },
    {
      accessorKey: "entityType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Entity" />,
    },
    {
      accessorKey: "entityId",
      header: "Entity ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.entityId ? row.original.entityId.slice(-10) : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" className="size-8" onClick={() => onView(row.original)}>
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];
}
