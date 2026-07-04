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
import { useExpensesForMonth, useDeleteExpense } from "@/features/expenses/hooks/use-expenses";
import { buildExpenseColumns, type ExpenseRow } from "@/features/expenses/components/columns";
import { ExpenseFormDialog } from "@/features/expenses/components/expense-form-dialog";
import { formatCurrency } from "@/lib/utils";
import { todayDateString } from "@/lib/date";

export function ExpensesView() {
  const today = todayDateString();
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const { data, isLoading, isError, refetch } = useExpensesForMonth(month, year);
  const deleteExpense = useDeleteExpense();

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseRow | null>(null);

  const total = useMemo(() => (data ?? []).reduce((sum, e) => sum + Number(e.amount), 0), [data]);

  const columns = useMemo(
    () =>
      buildExpenseColumns(
        (expense) => {
          setEditingExpense(expense);
          setFormOpen(true);
        },
        (expense) => setDeletingExpense(expense),
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
              setEditingExpense(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add expense
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No expenses for this month"
        emptyDescription="Record an expense as soon as you spend on the mess."
      />

      <ExpenseFormDialog open={formOpen} onOpenChange={setFormOpen} expense={editingExpense} />

      <AlertDialog open={!!deletingExpense} onOpenChange={(open) => !open && setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingExpense) deleteExpense.mutate(deletingExpense.id);
                setDeletingExpense(null);
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
