"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCustomersAction, createCustomerAction, updateCustomerAction, deleteCustomerAction } from "@/features/customers/actions";
import type { CustomerInput } from "@/features/customers/schemas/customer-schema";

const CUSTOMERS_QUERY_KEY = ["customers"];

export function useCustomers() {
  return useQuery({ queryKey: CUSTOMERS_QUERY_KEY, queryFn: getCustomersAction });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomerInput) => createCustomerAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Customer added.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) => updateCustomerAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Customer updated.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomerAction(id),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Customer deleted.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}
