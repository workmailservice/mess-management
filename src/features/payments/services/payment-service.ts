import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import { findCustomerById } from "@/features/customers/repositories/customer-repository";
import * as invoiceRepo from "@/features/billing/repositories/invoice-repository";
import { computeInvoiceStatus } from "@/features/billing/services/billing-service";
import * as paymentRepo from "@/features/payments/repositories/payment-repository";
import type { RecordPaymentInput } from "@/features/payments/schemas/payment-schema";

export async function listPayments() {
  await requirePermission(PERMISSIONS.payments.view);
  return paymentRepo.findManyPayments();
}

export async function recordPayment(input: RecordPaymentInput) {
  await requirePermission(PERMISSIONS.payments.record);

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  const customer = await findCustomerById(input.customerId);
  if (!customer) throw new Error("Customer not found.");

  let invoice = null;
  if (input.invoiceId) {
    invoice = await invoiceRepo.findInvoiceById(input.invoiceId);
    if (!invoice || invoice.customerId !== input.customerId) {
      throw new Error("Invoice not found for this customer.");
    }
  }

  const payment = await paymentRepo.createPayment({
    customerId: input.customerId,
    invoiceId: input.invoiceId || null,
    amount: input.amount,
    method: input.method,
    transactionRef: input.transactionRef || null,
    receivedById: session.user.id,
  });

  if (invoice) {
    const paidTotal = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0) + input.amount;
    const newStatus = computeInvoiceStatus(Number(invoice.amount), paidTotal, invoice.dueDate);
    await invoiceRepo.updateInvoiceStatus(invoice.id, newStatus);
  }

  await logAudit({
    action: "CREATE",
    entityType: "Payment",
    entityId: payment.id,
    after: { customerId: input.customerId, invoiceId: input.invoiceId, amount: input.amount, method: input.method },
  });

  return payment;
}
