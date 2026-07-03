"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Lock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export interface RoleRow {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissionKeys: string[];
}

export function buildRoleColumns(onEdit: (role: RoleRow) => void, onDelete: (role: RoleRow) => void): ColumnDef<RoleRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          {row.original.name}
          {row.original.isSystem && <Lock className="size-3.5 text-muted-foreground" />}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.description || "—"}</span>,
    },
    {
      accessorKey: "permissionKeys",
      header: "Permissions",
      cell: ({ row }) => <Badge variant="secondary">{row.original.permissionKeys.length}</Badge>,
    },
    {
      accessorKey: "userCount",
      header: "Users",
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
            <DropdownMenuItem
              variant="destructive"
              disabled={row.original.isSystem}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
