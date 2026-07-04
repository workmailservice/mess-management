"use server";

import { revalidatePath } from "next/cache";
import * as paymentService from "@/features/payments/services/payment-service";
import { findOutstandingInvoicesForCustomer } from "@/features/payments/repositories/payment-repository";
import { recordPaymentSchema } from "@/features/payments/schemas/payment-schema";
import type { RecordPaymentInput } from "@/features/payments/schemas/payment-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getPaymentsAction() {
  const payments = await paymentService.listPayments();
  return payments.map((payment) => ({
    id: payment.id,
    amount: payment.amount.toString(),
    method: payment.method,
    transactionRef: payment.transactionRef,
    paidAt: payment.paidAt.toISOString(),
    customer: payment.customer,
    invoice: payment.invoice,
  }));
}

export async function getOutstandingInvoicesAction(customerId: string) {
  const invoices = await findOutstandingInvoicesForCustomer(customerId);
  return invoices.map((invoice) => {
    const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    return {
      id: invoice.id,
      month: invoice.month,
      year: invoice.year,
      balance: (Number(invoice.amount) - paid).toString(),
    };
  });
}

export async function recordPaymentAction(input: RecordPaymentInput) {
  const parsed = recordPaymentSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await paymentService.recordPayment(parsed.data);
    revalidatePath("/payments");
    revalidatePath("/billing");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
