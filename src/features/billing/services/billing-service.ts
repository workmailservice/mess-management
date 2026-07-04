import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { findActiveCustomersForBilling } from "@/features/customers/repositories/customer-repository";
import * as invoiceRepo from "@/features/billing/repositories/invoice-repository";
import type { GenerateInvoicesInput } from "@/features/billing/schemas/billing-schema";
import type { InvoiceStatus } from "@/generated/prisma";

/** Recomputed at read time so an invoice reflects reality even if nothing wrote to it since its due date passed. */
export function computeInvoiceStatus(totalAmount: number, paidAmount: number, dueDate: Date): InvoiceStatus {
  if (totalAmount > 0 && paidAmount >= totalAmount) return "PAID";
  if (paidAmount > 0) return "PARTIAL";
  if (dueDate.getTime() < Date.now()) return "OVERDUE";
  return "PENDING";
}

export async function listInvoicesForMonth(month: number, year: number) {
  await requirePermission(PERMISSIONS.billing.view);
  const invoices = await invoiceRepo.findManyInvoicesForMonth(month, year);

  return invoices.map((invoice) => {
    const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const amount = Number(invoice.amount);
    return {
      id: invoice.id,
      customerId: invoice.customer.id,
      customerName: invoice.customer.name,
      customerPhone: invoice.customer.phone,
      amount: amount.toString(),
      paid: paid.toString(),
      balance: (amount - paid).toString(),
      dueDate: invoice.dueDate.toISOString(),
      status: invoice.status === "CANCELLED" ? "CANCELLED" : computeInvoiceStatus(amount, paid, invoice.dueDate),
    };
  });
}

export async function getInvoiceDetail(id: string) {
  await requirePermission(PERMISSIONS.billing.view);
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new Error("Invoice not found.");

  const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const amount = Number(invoice.amount);

  return {
    id: invoice.id,
    month: invoice.month,
    year: invoice.year,
    dueDate: invoice.dueDate.toISOString(),
    amount: amount.toString(),
    paidTotal: paid.toString(),
    balance: (amount - paid).toString(),
    status: invoice.status === "CANCELLED" ? "CANCELLED" : computeInvoiceStatus(amount, paid, invoice.dueDate),
    customer: {
      id: invoice.customer.id,
      name: invoice.customer.name,
      phone: invoice.customer.phone,
      email: invoice.customer.email,
      address: invoice.customer.address,
    },
    items: invoice.items.map((item) => ({ id: item.id, description: item.description, amount: item.amount.toString() })),
    payments: invoice.payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount.toString(),
      method: payment.method,
      transactionRef: payment.transactionRef,
      paidAt: payment.paidAt.toISOString(),
    })),
  };
}

export async function generateInvoicesForMonth(input: GenerateInvoicesInput) {
  await requirePermission(PERMISSIONS.billing.generateInvoice);

  const [allActiveCustomers, existingCustomerIds] = await Promise.all([
    findActiveCustomersForBilling(),
    invoiceRepo.findExistingCustomerIdsForMonth(input.month, input.year),
  ]);

  const customersNeedingInvoices = allActiveCustomers.filter((customer) => !existingCustomerIds.has(customer.id));

  if (customersNeedingInvoices.length === 0) {
    return { created: 0, skipped: allActiveCustomers.length };
  }

  await invoiceRepo.createInvoicesForCustomers(customersNeedingInvoices, input.month, input.year, input.dueDate);

  return { created: customersNeedingInvoices.length, skipped: existingCustomerIds.size };
}
