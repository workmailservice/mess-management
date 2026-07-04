"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaymentSettingsAction, updatePaymentSettingsAction } from "@/features/settings/actions";
import type { PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";

const PAYMENT_SETTINGS_QUERY_KEY = ["payment-settings"];

export function usePaymentSettings() {
  return useQuery({ queryKey: PAYMENT_SETTINGS_QUERY_KEY, queryFn: getPaymentSettingsAction });
}

export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentSettingsInput) => updatePaymentSettingsAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Payment settings saved.");
      queryClient.invalidateQueries({ queryKey: PAYMENT_SETTINGS_QUERY_KEY });
    },
  });
}
