"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { paymentColumns } from "@/features/payments/components/columns";
import { RecordPaymentDialog } from "@/features/payments/components/record-payment-dialog";
import { usePayments } from "@/features/payments/hooks/use-payments";

export function PaymentsView() {
  const { data, isLoading, isError, refetch } = usePayments();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <DataTable
        columns={paymentColumns}
        data={data ?? []}
        searchColumn="customerName"
        searchPlaceholder="Search by customer..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No payments recorded yet"
        emptyDescription="Record a payment as soon as a customer pays."
        toolbar={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Record payment
          </Button>
        }
      />

      <RecordPaymentDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
