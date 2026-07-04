"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useOutstandingInvoices, useRecordPayment } from "@/features/payments/hooks/use-payments";
import { recordPaymentSchema, type RecordPaymentInput } from "@/features/payments/schemas/payment-schema";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PAYMENT_METHODS: RecordPaymentInput["method"][] = ["CASH", "UPI", "BANK_TRANSFER", "CARD", "ONLINE"];

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCustomerId?: string;
  defaultInvoiceId?: string;
  lockCustomer?: boolean;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  defaultCustomerId,
  defaultInvoiceId,
  lockCustomer,
}: RecordPaymentDialogProps) {
  const { data: customers } = useCustomers();
  const recordPayment = useRecordPayment();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecordPaymentInput>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      customerId: defaultCustomerId ?? "",
      invoiceId: defaultInvoiceId ?? "",
      amount: 0,
      method: "CASH",
      transactionRef: "",
    },
  });

  const customerId = watch("customerId");
  const { data: outstandingInvoices } = useOutstandingInvoices(customerId || null);

  useEffect(() => {
    if (open) {
      reset({
        customerId: defaultCustomerId ?? "",
        invoiceId: defaultInvoiceId ?? "",
        amount: 0,
        method: "CASH",
        transactionRef: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultCustomerId, defaultInvoiceId]);

  // Pre-filling the amount from a *default* invoice can only happen once its balance has
  // loaded — the reset() above runs before outstandingInvoices is populated.
  useEffect(() => {
    if (!open || !defaultInvoiceId || !outstandingInvoices) return;
    const invoice = outstandingInvoices.find((inv) => inv.id === defaultInvoiceId);
    if (invoice) setValue("amount", Number(invoice.balance), { shouldValidate: true });
  }, [open, defaultInvoiceId, outstandingInvoices, setValue]);

  async function onSubmit(values: RecordPaymentInput) {
    const result = await recordPayment.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>Record a payment received from a customer, optionally against an invoice.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.customerId}>
              <FieldLabel>Customer</FieldLabel>
              <Select
                value={customerId}
                disabled={lockCustomer}
                onValueChange={(value) => {
                  if (!value) return;
                  setValue("customerId", value, { shouldValidate: true });
                  setValue("invoiceId", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.customerId]} />
            </Field>

            <Field>
              <FieldLabel>Invoice (optional)</FieldLabel>
              <Select
                value={watch("invoiceId") || "none"}
                disabled={!customerId}
                onValueChange={(value) => {
                  if (!value || value === "none") {
                    setValue("invoiceId", "");
                    return;
                  }
                  const invoice = outstandingInvoices?.find((inv) => inv.id === value);
                  setValue("invoiceId", value);
                  if (invoice) setValue("amount", Number(invoice.balance), { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No specific invoice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific invoice</SelectItem>
                  {outstandingInvoices?.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {MONTH_NAMES[invoice.month - 1]} {invoice.year} — balance {invoice.balance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="payment-amount">Amount (₹)</FieldLabel>
              <Input id="payment-amount" type="number" step="0.01" min="0" {...register("amount", { valueAsNumber: true })} />
              <FieldError errors={[errors.amount]} />
            </Field>

            <Field>
              <FieldLabel>Method</FieldLabel>
              <Select value={watch("method")} onValueChange={(value) => value && setValue("method", value as RecordPaymentInput["method"])}>
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
              <FieldLabel htmlFor="transaction-ref">Transaction reference (optional)</FieldLabel>
              <Input id="transaction-ref" {...register("transactionRef")} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={recordPayment.isPending}>
              {recordPayment.isPending && <Loader2 className="size-4 animate-spin" />}
              Record payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
