"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getInvoicesForMonthAction, getInvoiceDetailAction, generateInvoicesAction } from "@/features/billing/actions";
import type { GenerateInvoicesInput } from "@/features/billing/schemas/billing-schema";

export function useInvoicesForMonth(month: number, year: number) {
  return useQuery({
    queryKey: ["invoices", year, month],
    queryFn: () => getInvoicesForMonthAction(month, year),
  });
}

export function useInvoiceDetail(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceDetailAction(id),
  });
}

export function useGenerateInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateInvoicesInput) => generateInvoicesAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(`Generated ${result.created} invoice(s)${result.skipped ? `, ${result.skipped} already existed` : ""}.`);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
