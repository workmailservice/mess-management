import { prisma } from "@/lib/prisma";

export function findOutstandingInvoices() {
  return prisma.invoice.findMany({
    where: { status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } },
    orderBy: { dueDate: "asc" },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      payments: { select: { amount: true } },
      reminders: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
  });
}

export function createReminderLog(data: { customerId: string; invoiceId: string; message: string; sentById: string }) {
  return prisma.paymentReminder.create({ data });
}
