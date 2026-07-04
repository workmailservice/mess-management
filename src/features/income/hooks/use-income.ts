"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getIncomeCategoriesAction,
  createIncomeCategoryAction,
  getIncomeForMonthAction,
  createIncomeAction,
  updateIncomeAction,
  deleteIncomeAction,
} from "@/features/income/actions";
import type { IncomeInput } from "@/features/income/schemas/income-schema";

export function useIncomeCategories() {
  return useQuery({ queryKey: ["income-categories"], queryFn: getIncomeCategoriesAction });
}

export function useCreateIncomeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createIncomeCategoryAction(name),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Category added.");
      queryClient.invalidateQueries({ queryKey: ["income-categories"] });
    },
  });
}

export function useIncomeForMonth(month: number, year: number) {
  return useQuery({ queryKey: ["income", year, month], queryFn: () => getIncomeForMonthAction(month, year) });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IncomeInput) => createIncomeAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Income added.");
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: IncomeInput }) => updateIncomeAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Income updated.");
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIncomeAction(id),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Income deleted.");
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}
