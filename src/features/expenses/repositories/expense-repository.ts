import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";
import type { PaymentMethod } from "@/generated/prisma";

export function findManyCategories() {
  return prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
}

export function createCategory(name: string) {
  return prisma.expenseCategory.create({ data: { name } });
}

export function findManyExpensesForMonth(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
  return prisma.expense.findMany({
    where: { date: { gte: start, lt: end } },
    orderBy: { date: "desc" },
    include: { category: { select: { id: true, name: true } } },
  });
}

export function findExpenseById(id: string) {
  return prisma.expense.findUnique({ where: { id } });
}

export function createExpense(data: {
  categoryId: string;
  amount: number;
  description: string | null;
  vendorName: string | null;
  paymentMethod: PaymentMethod;
  date: string;
  createdById: string;
}) {
  return prisma.expense.create({
    data: { ...data, date: parseDateOnly(data.date) },
  });
}

export function updateExpense(
  id: string,
  data: {
    categoryId: string;
    amount: number;
    description: string | null;
    vendorName: string | null;
    paymentMethod: PaymentMethod;
    date: string;
  },
) {
  return prisma.expense.update({ where: { id }, data: { ...data, date: parseDateOnly(data.date) } });
}

export function deleteExpense(id: string) {
  return prisma.expense.delete({ where: { id } });
}

export function sumExpensesForRange(start: Date, end: Date) {
  return prisma.expense.groupBy({
    by: ["categoryId"],
    where: { date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
}
