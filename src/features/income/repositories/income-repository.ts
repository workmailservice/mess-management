import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";

export function findManyCategories() {
  return prisma.incomeCategory.findMany({ orderBy: { name: "asc" } });
}

export function createCategory(name: string) {
  return prisma.incomeCategory.create({ data: { name } });
}

export function findManyIncomeForMonth(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
  return prisma.income.findMany({
    where: { date: { gte: start, lt: end } },
    orderBy: { date: "desc" },
    include: { category: { select: { id: true, name: true } } },
  });
}

export function findIncomeById(id: string) {
  return prisma.income.findUnique({ where: { id } });
}

export function createIncome(data: {
  categoryId: string;
  amount: number;
  source: string | null;
  description: string | null;
  date: string;
  createdById: string;
}) {
  return prisma.income.create({ data: { ...data, date: parseDateOnly(data.date) } });
}

export function updateIncome(
  id: string,
  data: { categoryId: string; amount: number; source: string | null; description: string | null; date: string },
) {
  return prisma.income.update({ where: { id }, data: { ...data, date: parseDateOnly(data.date) } });
}

export function deleteIncome(id: string) {
  return prisma.income.delete({ where: { id } });
}
