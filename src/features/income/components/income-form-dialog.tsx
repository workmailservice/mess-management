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
import { useCreateIncome, useUpdateIncome, useIncomeCategories, useCreateIncomeCategory } from "@/features/income/hooks/use-income";
import { incomeSchema, type IncomeInput } from "@/features/income/schemas/income-schema";
import { todayDateString } from "@/lib/date";
import type { IncomeRow } from "@/features/income/components/columns";

interface IncomeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: IncomeRow | null;
}

const EMPTY_VALUES: IncomeInput = {
  categoryId: "",
  amount: 0,
  source: "",
  description: "",
  date: todayDateString(),
};

export function IncomeFormDialog({ open, onOpenChange, income }: IncomeFormDialogProps) {
  const isEdit = !!income;
  const { data: categories } = useIncomeCategories();
  const createCategory = useCreateIncomeCategory();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const pending = createIncome.isPending || updateIncome.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IncomeInput>({ resolver: zodResolver(incomeSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      income
        ? {
            categoryId: income.category.id,
            amount: Number(income.amount),
            source: income.source ?? "",
            description: income.description ?? "",
            date: income.date.slice(0, 10),
          }
        : EMPTY_VALUES,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, income]);

  async function onSubmit(values: IncomeInput) {
    const result = isEdit
      ? await updateIncome.mutateAsync({ id: income.id, input: values })
      : await createIncome.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit income" : "Add income"}</DialogTitle>
            <DialogDescription>Record income other than customer payments.</DialogDescription>
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
                <FieldLabel htmlFor="income-amount">Amount (₹)</FieldLabel>
                <Input id="income-amount" type="number" step="0.01" min="0" {...register("amount", { valueAsNumber: true })} />
                <FieldError errors={[errors.amount]} />
              </Field>

              <Field data-invalid={!!errors.date}>
                <FieldLabel htmlFor="income-date">Date</FieldLabel>
                <Input id="income-date" type="date" {...register("date")} />
                <FieldError errors={[errors.date]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="income-source">Source (optional)</FieldLabel>
                <Input id="income-source" {...register("source")} />
              </Field>

              <Field>
                <FieldLabel htmlFor="income-description">Description (optional)</FieldLabel>
                <Input id="income-description" {...register("description")} />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? "Save changes" : "Add income"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CategoryManagerDialog
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
        title="Income categories"
        categories={categories ?? []}
        isPending={createCategory.isPending}
        onCreate={(name) => createCategory.mutate(name)}
      />
    </>
  );
}
