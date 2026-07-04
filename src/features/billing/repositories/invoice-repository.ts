import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";
import type { InvoiceStatus, Prisma } from "@/generated/prisma";

export function findManyInvoicesForMonth(month: number, year: number) {
  return prisma.invoice.findMany({
    where: { month, year },
    orderBy: { customer: { name: "asc" } },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      payments: { select: { amount: true } },
    },
  });
}

export function findInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

export async function findExistingCustomerIdsForMonth(month: number, year: number) {
  const rows = await prisma.invoice.findMany({ where: { month, year }, select: { customerId: true } });
  return new Set(rows.map((row) => row.customerId));
}

export function createInvoicesForCustomers(
  customers: { id: string; monthlyRate: Prisma.Decimal }[],
  month: number,
  year: number,
  dueDate: string,
) {
  const due = parseDateOnly(dueDate);
  return prisma.$transaction(
    customers.map((customer) =>
      prisma.invoice.create({
        data: {
          customerId: customer.id,
          month,
          year,
          dueDate: due,
          amount: customer.monthlyRate,
          status: "PENDING",
          items: { create: [{ description: "Monthly Charge", amount: customer.monthlyRate }] },
        },
      }),
    ),
  );
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  return prisma.invoice.update({ where: { id }, data: { status } });
}
