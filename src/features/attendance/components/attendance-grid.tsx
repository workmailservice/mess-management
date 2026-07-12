"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Send } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { MonthNavigator } from "@/features/attendance/components/month-navigator";
import { AttendanceSummaryCards } from "@/features/attendance/components/attendance-summary-cards";
import { AttendanceDayCell } from "@/features/attendance/components/attendance-day-cell";
import { useAttendanceForMonth, useSetAttendance } from "@/features/attendance/hooks/use-attendance";
import { usePaymentSettings } from "@/features/settings/hooks/use-payment-settings";
import { buildAttendanceMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { todayMonth, daysInMonth, dateStringForDay, todayDateString, formatMonthLabel } from "@/lib/date";

interface AttendanceRow {
  id: string;
  name: string;
  phone: string;
}

function buildAttendanceColumns(
  year: number,
  month: number,
  dayCount: number,
  cumulativeFor: (customerId: string, day: number) => number,
  rawFor: (customerId: string, day: number) => number,
  onSave: (customerId: string, day: number, value: number) => void,
  pendingKey: string | null,
  today: string,
  onSendAttendance: (customerId: string, name: string, phone: string) => void,
): ColumnDef<AttendanceRow>[] {
  const dayColumns: ColumnDef<AttendanceRow>[] = Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    const date = dateStringForDay(year, month, day);
    const locked = date > today;
    return {
      id: `day-${day}`,
      header: String(day),
      cell: ({ row }) => (
        <AttendanceDayCell
          cumulative={cumulativeFor(row.original.id, day)}
          rawValue={rawFor(row.original.id, day)}
          disabled={pendingKey === `${row.original.id}:${date}`}
          locked={locked}
          onSave={(value) => onSave(row.original.id, day, value)}
        />
      ),
    };
  });

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
    ...dayColumns,
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSendAttendance(row.original.id, row.original.name, row.original.phone)}
        >
          <Send className="size-3.5" />
          Send
        </Button>
      ),
    },
  ];
}

export function AttendanceGrid() {
  const [{ year, month }, setPeriod] = useState(todayMonth());
  const { data, isLoading, isError, refetch } = useAttendanceForMonth(year, month);
  const { data: paymentSettings } = usePaymentSettings();
  const setAttendance = useSetAttendance(year, month);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const dayCount = daysInMonth(year, month);

  const incrementMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const record of data?.records ?? []) {
      map.set(`${record.customerId}:${record.date}`, record.count);
    }
    return map;
  }, [data]);

  const cumulativeByCustomer = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const customer of data?.customers ?? []) {
      const running: number[] = [];
      let total = 0;
      for (let day = 1; day <= dayCount; day++) {
        total += incrementMap.get(`${customer.id}:${dateStringForDay(year, month, day)}`) ?? 0;
        running.push(total);
      }
      map.set(customer.id, running);
    }
    return map;
  }, [data, incrementMap, dayCount, year, month]);

  const cumulativeFor = (customerId: string, day: number) => cumulativeByCustomer.get(customerId)?.[day - 1] ?? 0;
  const rawFor = (customerId: string, day: number) =>
    incrementMap.get(`${customerId}:${dateStringForDay(year, month, day)}`) ?? 0;

  async function handleSave(customerId: string, day: number, value: number) {
    const date = dateStringForDay(year, month, day);
    const key = `${customerId}:${date}`;
    setPendingKey(key);
    await setAttendance.mutateAsync({ customerId, date, count: value });
    setPendingKey(null);
  }

  function handleSendAttendance(customerId: string, name: string, phone: string) {
    const totalTiffins = cumulativeByCustomer.get(customerId)?.[dayCount - 1] ?? 0;
    const message = buildAttendanceMessage({
      customerName: name,
      monthLabel: formatMonthLabel(year, month),
      totalTiffins,
      businessName: paymentSettings?.businessName ?? "Mess Management",
    });
    // Open first (synchronously, in the click handler) so browsers don't block the popup.
    window.open(buildWhatsAppLink(phone, message), "_blank", "noopener,noreferrer");
  }

  const columns = useMemo(
    () =>
      buildAttendanceColumns(
        year,
        month,
        dayCount,
        cumulativeFor,
        rawFor,
        handleSave,
        pendingKey,
        todayDateString(),
        handleSendAttendance,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cumulativeByCustomer, incrementMap, pendingKey, year, month, dayCount, paymentSettings],
  );

  const totalTiffinsThisMonth = useMemo(() => {
    let total = 0;
    for (const count of incrementMap.values()) total += count;
    return total;
  }, [incrementMap]);

  return (
    <div className="space-y-6">
      <MonthNavigator year={year} month={month} onChange={setPeriod} />

      <AttendanceSummaryCards totalActive={data?.customers.length ?? 0} totalTiffinsThisMonth={totalTiffinsThisMonth} />

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
