"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEntityTypes } from "@/features/audit-logs/hooks/use-audit-logs";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

const ACTIONS = ["CREATE", "UPDATE", "DELETE", "DEACTIVATE", "REACTIVATE", "PASSWORD_RESET"];

interface AuditLogFiltersBarProps {
  filters: AuditLogFilters;
  onChange: (filters: AuditLogFilters) => void;
}

export function AuditLogFiltersBar({ filters, onChange }: AuditLogFiltersBarProps) {
  const { data: entityTypes } = useEntityTypes();
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.entityType ?? "all"} onValueChange={(value) => value && onChange({ ...filters, entityType: value === "all" ? undefined : value })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All entities</SelectItem>
          {entityTypes?.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.action ?? "all"} onValueChange={(value) => value && onChange({ ...filters, action: value === "all" ? undefined : value })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {ACTIONS.map((action) => (
            <SelectItem key={action} value={action}>
              {action}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        className="w-40"
        value={filters.fromDate ?? ""}
        onChange={(e) => onChange({ ...filters, fromDate: e.target.value || undefined })}
      />
      <span className="text-sm text-muted-foreground">to</span>
      <Input
        type="date"
        className="w-40"
        value={filters.toDate ?? ""}
        onChange={(e) => onChange({ ...filters, toDate: e.target.value || undefined })}
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
