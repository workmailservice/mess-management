import { prisma } from "@/lib/prisma";

function monthRange(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
  return { start, end };
}

export async function sumPaymentsForMonth(month: number, year: number) {
  const { start, end } = monthRange(month, year);
  const result = await prisma.payment.aggregate({
    where: { paidAt: { gte: start, lt: end }, status: "SUCCESS" },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

export async function sumExpensesForMonth(month: number, year: number) {
  const { start, end } = monthRange(month, year);
  const result = await prisma.expense.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

export async function sumIncomeForMonth(month: number, year: number) {
  const { start, end } = monthRange(month, year);
  const result = await prisma.income.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

export async function expensesByCategoryForMonth(month: number, year: number) {
  const { start, end } = monthRange(month, year);
  const expenses = await prisma.expense.findMany({
    where: { date: { gte: start, lt: end } },
    select: { amount: true, category: { select: { name: true } } },
  });

  const totals = new Map<string, number>();
  for (const expense of expenses) {
    totals.set(expense.category.name, (totals.get(expense.category.name) ?? 0) + Number(expense.amount));
  }
  return Array.from(totals, ([name, amount]) => ({ name, amount }));
}
