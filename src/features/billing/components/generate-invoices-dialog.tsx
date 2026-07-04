"use client";

import { useState } from "react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGenerateInvoices } from "@/features/billing/hooks/use-billing";

interface GenerateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: number;
  year: number;
}

function defaultDueDate(month: number, year: number) {
  const mm = String(month).padStart(2, "0");
  return `${year}-${mm}-10`;
}

export function GenerateInvoicesDialog({ open, onOpenChange, month, year }: GenerateInvoicesDialogProps) {
  const [dueDate, setDueDate] = useState(() => defaultDueDate(month, year));
  const generateInvoices = useGenerateInvoices();

  async function handleGenerate() {
    const result = await generateInvoices.mutateAsync({ month, year, dueDate });
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDueDate(defaultDueDate(month, year));
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Generate invoices</DialogTitle>
          <DialogDescription>
            Creates one invoice per active customer for the selected month, using their current monthly rate.
            Customers who already have an invoice for this month are skipped.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="due-date">Due date</FieldLabel>
          <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={generateInvoices.isPending}>
            {generateInvoices.isPending && <Loader2 className="size-4 animate-spin" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
