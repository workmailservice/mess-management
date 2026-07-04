"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecordPaymentDialog } from "@/features/payments/components/record-payment-dialog";

interface RecordPaymentButtonProps {
  customerId: string;
  invoiceId: string;
}

export function RecordPaymentButton({ customerId, invoiceId }: RecordPaymentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Wallet className="size-4" />
        Record payment
      </Button>
      <RecordPaymentDialog
        open={open}
        onOpenChange={setOpen}
        defaultCustomerId={customerId}
        defaultInvoiceId={invoiceId}
        lockCustomer
      />
    </>
  );
}
