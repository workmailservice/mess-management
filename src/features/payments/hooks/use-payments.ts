"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaymentsAction, getOutstandingInvoicesAction, recordPaymentAction } from "@/features/payments/actions";
import type { RecordPaymentInput } from "@/features/payments/schemas/payment-schema";

export function usePayments() {
  return useQuery({ queryKey: ["payments"], queryFn: getPaymentsAction });
}

export function useOutstandingInvoices(customerId: string | null) {
  return useQuery({
    queryKey: ["outstanding-invoices", customerId],
    queryFn: () => getOutstandingInvoicesAction(customerId as string),
    enabled: !!customerId,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecordPaymentInput) => recordPaymentAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Payment recorded.");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
      queryClient.invalidateQueries({ queryKey: ["outstanding-invoices"] });
    },
  });
}
