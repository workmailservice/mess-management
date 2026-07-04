"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { MonthNavigator } from "@/features/billing/components/month-navigator";
import { GenerateInvoicesDialog } from "@/features/billing/components/generate-invoices-dialog";
import { invoiceColumns } from "@/features/billing/components/columns";
import { useInvoicesForMonth } from "@/features/billing/hooks/use-billing";
import { todayDateString } from "@/lib/date";

export function BillingView() {
  const today = todayDateString();
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useInvoicesForMonth(month, year);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MonthNavigator month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
        <Button onClick={() => setGenerateOpen(true)}>
          <Plus className="size-4" />
          Generate invoices
        </Button>
      </div>

      <DataTable
        columns={invoiceColumns}
        data={data ?? []}
        searchColumn="customerName"
        searchPlaceholder="Search by customer..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No invoices for this month"
        emptyDescription="Generate invoices to bill your active customers for this month."
      />

      <GenerateInvoicesDialog open={generateOpen} onOpenChange={setGenerateOpen} month={month} year={year} />
    </div>
  );
}
