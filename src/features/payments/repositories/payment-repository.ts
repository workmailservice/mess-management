import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/generated/prisma";

export function findManyPayments() {
  return prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      invoice: { select: { id: true, month: true, year: true } },
    },
  });
}

export function findOutstandingInvoicesForCustomer(customerId: string) {
  return prisma.invoice.findMany({
    where: { customerId, status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { payments: { select: { amount: true } } },
  });
}

export function createPayment(data: {
  customerId: string;
  invoiceId: string | null;
  amount: number;
  method: PaymentMethod;
  transactionRef: string | null;
  receivedById: string;
}) {
  return prisma.payment.create({ data });
}
