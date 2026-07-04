"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { usePaymentSettings, useUpdatePaymentSettings } from "@/features/settings/hooks/use-payment-settings";
import { paymentSettingsSchema, type PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";

export function PaymentSettingsForm() {
  const { data, isLoading } = usePaymentSettings();
  const updateSettings = useUpdatePaymentSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentSettingsInput>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: { businessName: "", upiId: "" },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  if (isLoading) return null;

  return (
    <form onSubmit={handleSubmit((values) => updateSettings.mutate(values))} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.businessName}>
          <FieldLabel htmlFor="business-name">Business name</FieldLabel>
          <Input id="business-name" {...register("businessName")} />
          <FieldDescription>Shown on PDF receipts.</FieldDescription>
          <FieldError errors={[errors.businessName]} />
        </Field>

        <Field data-invalid={!!errors.upiId}>
          <FieldLabel htmlFor="upi-id">UPI ID</FieldLabel>
          <Input id="upi-id" placeholder="yourname@upi" {...register("upiId")} />
          <FieldDescription>Used to generate payment QR codes on invoices.</FieldDescription>
          <FieldError errors={[errors.upiId]} />
        </Field>

        <div>
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
