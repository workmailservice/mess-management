import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as expenseRepo from "@/features/expenses/repositories/expense-repository";
import type { ExpenseInput } from "@/features/expenses/schemas/expense-schema";

export async function listCategories() {
  await requirePermission(PERMISSIONS.expenses.view);
  return expenseRepo.findManyCategories();
}

export async function createCategory(name: string) {
  await requirePermission(PERMISSIONS.expenses.create);
  return expenseRepo.createCategory(name);
}

export async function listExpensesForMonth(month: number, year: number) {
  await requirePermission(PERMISSIONS.expenses.view);
  return expenseRepo.findManyExpensesForMonth(month, year);
}

export async function createExpense(input: ExpenseInput) {
  await requirePermission(PERMISSIONS.expenses.create);

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  const expense = await expenseRepo.createExpense({
    categoryId: input.categoryId,
    amount: input.amount,
    description: input.description || null,
    vendorName: input.vendorName || null,
    paymentMethod: input.paymentMethod,
    date: input.date,
    createdById: session.user.id,
  });

  await logAudit({ action: "CREATE", entityType: "Expense", entityId: expense.id, after: { amount: input.amount, categoryId: input.categoryId } });
  return expense;
}

export async function updateExpense(id: string, input: ExpenseInput) {
  await requirePermission(PERMISSIONS.expenses.create);

  const before = await expenseRepo.findExpenseById(id);
  if (!before) throw new Error("Expense not found.");

  const expense = await expenseRepo.updateExpense(id, {
    categoryId: input.categoryId,
    amount: input.amount,
    description: input.description || null,
    vendorName: input.vendorName || null,
    paymentMethod: input.paymentMethod,
    date: input.date,
  });

  await logAudit({
    action: "UPDATE",
    entityType: "Expense",
    entityId: id,
    before: { amount: before.amount.toString(), categoryId: before.categoryId },
    after: { amount: input.amount, categoryId: input.categoryId },
  });

  return expense;
}

export async function deleteExpense(id: string) {
  await requirePermission(PERMISSIONS.expenses.create);

  const existing = await expenseRepo.findExpenseById(id);
  if (!existing) throw new Error("Expense not found.");

  await expenseRepo.deleteExpense(id);
  await logAudit({ action: "DELETE", entityType: "Expense", entityId: id, before: { amount: existing.amount.toString() } });
}
