import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { computeInvoiceStatus } from "@/features/billing/services/billing-service";
import { getPaymentSettings } from "@/features/settings/services/settings-service";
import * as reminderRepo from "@/features/reminders/repositories/reminder-repository";
import { buildReminderMessage } from "@/lib/whatsapp";
import type { LogReminderInput } from "@/features/reminders/schemas/reminder-schema";

type OutstandingStatus = "PENDING" | "PARTIAL" | "OVERDUE";

export async function listOutstanding() {
  await requirePermission(PERMISSIONS.reminders.view);

  const [invoices, settings] = await Promise.all([reminderRepo.findOutstandingInvoices(), getPaymentSettings()]);
  const businessName = settings?.businessName ?? "Mess Management";

  return invoices
    .map((invoice) => {
      const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const amount = Number(invoice.amount);
      const balance = amount - paid;
      const status = computeInvoiceStatus(amount, paid, invoice.dueDate);
      const message = buildReminderMessage({
        customerName: invoice.customer.name,
        balance,
        month: invoice.month,
        year: invoice.year,
        dueDate: invoice.dueDate,
        businessName,
      });

      return {
        invoiceId: invoice.id,
        customerId: invoice.customer.id,
        customerName: invoice.customer.name,
        customerPhone: invoice.customer.phone,
        month: invoice.month,
        year: invoice.year,
        dueDate: invoice.dueDate.toISOString(),
        balance: balance.toString(),
        // A positive balance (filtered below) can only ever compute to one of these three —
        // computeInvoiceStatus only returns PAID when balance <= 0, and never returns CANCELLED.
        status: status as OutstandingStatus,
        lastReminderAt: invoice.reminders[0]?.createdAt.toISOString() ?? null,
        message,
      };
    })
    .filter((invoice) => Number(invoice.balance) > 0);
}

export async function logReminderSent(input: LogReminderInput) {
  await requirePermission(PERMISSIONS.reminders.send);

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  return reminderRepo.createReminderLog({
    customerId: input.customerId,
    invoiceId: input.invoiceId,
    message: input.message,
    sentById: session.user.id,
  });
}
