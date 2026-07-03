"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DateNavigator } from "@/features/attendance/components/date-navigator";
import { MealSummaryCards } from "@/features/attendance/components/meal-summary-cards";
import { useAttendanceForDate, useSetAttendance } from "@/features/attendance/hooks/use-attendance";
import { todayDateString } from "@/lib/date";
import type { MealType, AttendanceStatus } from "@/generated/prisma";

interface AttendanceRow {
  id: string;
  name: string;
  phone: string;
}

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

function MealCell({
  status,
  disabled,
  onToggle,
}: {
  status: AttendanceStatus;
  disabled: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <Switch checked={status === "TAKEN"} disabled={disabled} onCheckedChange={onToggle} aria-label="Toggle meal taken" />
  );
}

function buildAttendanceColumns(
  statusFor: (customerId: string, mealType: MealType) => AttendanceStatus,
  onToggle: (customerId: string, mealType: MealType, checked: boolean) => void,
  pendingKey: string | null,
): ColumnDef<AttendanceRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone}</span>,
    },
    ...MEAL_TYPES.map(
      (mealType): ColumnDef<AttendanceRow> => ({
        id: mealType,
        header: mealType.charAt(0) + mealType.slice(1).toLowerCase(),
        cell: ({ row }) => (
          <MealCell
            status={statusFor(row.original.id, mealType)}
            disabled={pendingKey === `${row.original.id}:${mealType}`}
            onToggle={(checked) => onToggle(row.original.id, mealType, checked)}
          />
        ),
      }),
    ),
  ];
}

export function AttendanceGrid() {
  const [date, setDate] = useState(todayDateString());
  const { data, isLoading, isError, refetch } = useAttendanceForDate(date);
  const setAttendance = useSetAttendance(date);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const statusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    for (const record of data?.records ?? []) {
      map.set(`${record.customerId}:${record.mealType}`, record.status);
    }
    return map;
  }, [data]);

  const statusFor = (customerId: string, mealType: MealType): AttendanceStatus =>
    statusMap.get(`${customerId}:${mealType}`) ?? "TAKEN";

  async function handleToggle(customerId: string, mealType: MealType, checked: boolean) {
    const key = `${customerId}:${mealType}`;
    setPendingKey(key);
    await setAttendance.mutateAsync({ customerId, date, mealType, status: checked ? "TAKEN" : "SKIPPED" });
    setPendingKey(null);
  }

  const columns = useMemo(
    () => buildAttendanceColumns(statusFor, handleToggle, pendingKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusMap, pendingKey, date],
  );

  const skippedCounts = useMemo(() => {
    const counts: Record<MealType, number> = { BREAKFAST: 0, LUNCH: 0, DINNER: 0 };
    for (const record of data?.records ?? []) {
      if (record.status === "SKIPPED") counts[record.mealType]++;
    }
    return counts;
  }, [data]);

  return (
    <div className="space-y-6">
      <DateNavigator date={date} onChange={setDate} />

      <MealSummaryCards totalActive={data?.customers.length ?? 0} skippedCounts={skippedCounts} />

      <DataTable
        columns={columns}
        data={data?.customers ?? []}
        searchColumn="name"
        searchPlaceholder="Search by name..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No active customers"
        emptyDescription="Add active customers to start tracking their attendance."
      />
    </div>
  );
}
