"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getExpenseCategoriesAction,
  createExpenseCategoryAction,
  getExpensesForMonthAction,
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
} from "@/features/expenses/actions";
import type { ExpenseInput } from "@/features/expenses/schemas/expense-schema";

export function useExpenseCategories() {
  return useQuery({ queryKey: ["expense-categories"], queryFn: getExpenseCategoriesAction });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createExpenseCategoryAction(name),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Category added.");
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}

export function useExpensesForMonth(month: number, year: number) {
  return useQuery({ queryKey: ["expenses", year, month], queryFn: () => getExpensesForMonthAction(month, year) });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExpenseInput) => createExpenseAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Expense added.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ExpenseInput }) => updateExpenseAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Expense updated.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpenseAction(id),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Expense deleted.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
