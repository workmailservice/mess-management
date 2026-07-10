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
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCustomer, useUpdateCustomer } from "@/features/customers/hooks/use-customers";
import { customerSchema, type CustomerInput } from "@/features/customers/schemas/customer-schema";
import type { CustomerRow } from "@/features/customers/components/columns";
import { todayDateString } from "@/lib/date";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CustomerRow | null;
}

const EMPTY_VALUES: CustomerInput = {
  name: "",
  phone: "",
  email: "",
  address: "",
  monthlyRate: 0,
  joinDate: todayDateString(),
  advancePaid: 0,
  advancePending: 0,
  status: "ACTIVE",
};

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const isEdit = !!customer;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const pending = createCustomer.isPending || updateCustomer.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerInput>({ resolver: zodResolver(customerSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    reset(
      customer
        ? {
            name: customer.name,
            phone: customer.phone,
            email: customer.email ?? "",
            address: customer.address ?? "",
            monthlyRate: Number(customer.monthlyRate),
            joinDate: customer.joinDate.slice(0, 10),
            advancePaid: Number(customer.advancePaid),
            advancePending: Number(customer.advancePending),
            status: customer.status,
          }
        : EMPTY_VALUES,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customer]);

  async function onSubmit(values: CustomerInput) {
    const result = isEdit
      ? await updateCustomer.mutateAsync({ id: customer.id, input: values })
      : await createCustomer.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit customer" : "Add customer"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this customer's details." : "Add a new customer and their monthly rate."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="customer-name">Name</FieldLabel>
              <Input id="customer-name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="customer-phone">Phone (with country code)</FieldLabel>
              <Input id="customer-phone" placeholder="+91 98765 43210" {...register("phone")} />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="customer-email">Email</FieldLabel>
              <Input id="customer-email" type="email" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="customer-address">Address</FieldLabel>
              <Textarea id="customer-address" rows={2} {...register("address")} />
            </Field>

            <Field data-invalid={!!errors.monthlyRate}>
              <FieldLabel htmlFor="customer-rate">Monthly rate (₹)</FieldLabel>
              <Input id="customer-rate" type="number" step="0.01" min="0" {...register("monthlyRate", { valueAsNumber: true })} />
              <FieldError errors={[errors.monthlyRate]} />
            </Field>

            <Field data-invalid={!!errors.joinDate}>
              <FieldLabel htmlFor="customer-join-date">Mess joining date</FieldLabel>
              <Input id="customer-join-date" type="date" {...register("joinDate")} />
              <FieldError errors={[errors.joinDate]} />
            </Field>

            <Field data-invalid={!!errors.advancePaid}>
              <FieldLabel htmlFor="customer-advance-paid">Advance paid (₹)</FieldLabel>
              <Input
                id="customer-advance-paid"
                type="number"
                step="0.01"
                min="0"
                {...register("advancePaid", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.advancePaid]} />
            </Field>

            <Field data-invalid={!!errors.advancePending}>
              <FieldLabel htmlFor="customer-advance-pending">Advance pending (₹)</FieldLabel>
              <Input
                id="customer-advance-pending"
                type="number"
                step="0.01"
                min="0"
                {...register("advancePending", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.advancePending]} />
            </Field>

            {isEdit && (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={watch("status")} onValueChange={(value) => value && setValue("status", value as CustomerInput["status"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
