"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { MonthNavigator } from "@/features/billing/components/month-navigator";
import { useIncomeForMonth, useDeleteIncome } from "@/features/income/hooks/use-income";
import { buildIncomeColumns, type IncomeRow } from "@/features/income/components/columns";
import { IncomeFormDialog } from "@/features/income/components/income-form-dialog";
import { formatCurrency } from "@/lib/utils";
import { todayDateString } from "@/lib/date";

export function IncomeView() {
  const today = todayDateString();
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const { data, isLoading, isError, refetch } = useIncomeForMonth(month, year);
  const deleteIncome = useDeleteIncome();

  const [formOpen, setFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRow | null>(null);
  const [deletingIncome, setDeletingIncome] = useState<IncomeRow | null>(null);

  const total = useMemo(() => (data ?? []).reduce((sum, i) => sum + Number(i.amount), 0), [data]);

  const columns = useMemo(
    () =>
      buildIncomeColumns(
        (income) => {
          setEditingIncome(income);
          setFormOpen(true);
        },
        (income) => setDeletingIncome(income),
      ),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MonthNavigator month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
          </p>
          <Button
            onClick={() => {
              setEditingIncome(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add income
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No income recorded for this month"
        emptyDescription="Customer payments are tracked automatically — use this for other income."
      />

      <IncomeFormDialog open={formOpen} onOpenChange={setFormOpen} income={editingIncome} />

      <AlertDialog open={!!deletingIncome} onOpenChange={(open) => !open && setDeletingIncome(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this income entry?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingIncome) deleteIncome.mutate(deletingIncome.id);
                setDeletingIncome(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
