"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryManagerDialog } from "@/components/forms/category-manager-dialog";
import { useCreateExpense, useUpdateExpense, useExpenseCategories, useCreateExpenseCategory } from "@/features/expenses/hooks/use-expenses";
import { expenseSchema, type ExpenseInput } from "@/features/expenses/schemas/expense-schema";
import { todayDateString } from "@/lib/date";
import type { ExpenseRow } from "@/features/expenses/components/columns";

const PAYMENT_METHODS: ExpenseInput["paymentMethod"][] = ["CASH", "UPI", "BANK_TRANSFER", "CARD", "ONLINE"];

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseRow | null;
}

const EMPTY_VALUES: ExpenseInput = {
  categoryId: "",
  amount: 0,
  description: "",
  vendorName: "",
  paymentMethod: "CASH",
  date: todayDateString(),
};

export function ExpenseFormDialog({ open, onOpenChange, expense }: ExpenseFormDialogProps) {
  const isEdit = !!expense;
  const { data: categories } = useExpenseCategories();
  const createCategory = useCreateExpenseCategory();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const pending = createExpense.isPending || updateExpense.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseInput>({ resolver: zodResolver(expenseSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      expense
        ? {
            categoryId: expense.category.id,
            amount: Number(expense.amount),
            description: expense.description ?? "",
            vendorName: expense.vendorName ?? "",
            paymentMethod: expense.paymentMethod,
            date: expense.date.slice(0, 10),
          }
        : EMPTY_VALUES,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, expense]);

  async function onSubmit(values: ExpenseInput) {
    const result = isEdit
      ? await updateExpense.mutateAsync({ id: expense.id, input: values })
      : await createExpense.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit expense" : "Add expense"}</DialogTitle>
            <DialogDescription>Record money spent on running the mess.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.categoryId}>
                <div className="flex items-center justify-between">
                  <FieldLabel>Category</FieldLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCategoryManagerOpen(true)}>
                    <Settings2 className="size-3.5" />
                    Manage
                  </Button>
                </div>
                <Select value={watch("categoryId")} onValueChange={(value) => value && setValue("categoryId", value, { shouldValidate: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.categoryId]} />
              </Field>

              <Field data-invalid={!!errors.amount}>
                <FieldLabel htmlFor="expense-amount">Amount (₹)</FieldLabel>
                <Input id="expense-amount" type="number" step="0.01" min="0" {...register("amount", { valueAsNumber: true })} />
                <FieldError errors={[errors.amount]} />
              </Field>

              <Field data-invalid={!!errors.date}>
                <FieldLabel htmlFor="expense-date">Date</FieldLabel>
                <Input id="expense-date" type="date" {...register("date")} />
                <FieldError errors={[errors.date]} />
              </Field>

              <Field>
                <FieldLabel>Payment method</FieldLabel>
                <Select value={watch("paymentMethod")} onValueChange={(value) => value && setValue("paymentMethod", value as ExpenseInput["paymentMethod"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="expense-vendor">Vendor (optional)</FieldLabel>
                <Input id="expense-vendor" {...register("vendorName")} />
              </Field>

              <Field>
                <FieldLabel htmlFor="expense-description">Description (optional)</FieldLabel>
                <Input id="expense-description" {...register("description")} />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? "Save changes" : "Add expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CategoryManagerDialog
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
        title="Expense categories"
        categories={categories ?? []}
        isPending={createCategory.isPending}
        onCreate={(name) => createCategory.mutate(name)}
      />
    </>
  );
}
