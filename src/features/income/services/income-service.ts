import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as incomeRepo from "@/features/income/repositories/income-repository";
import type { IncomeInput } from "@/features/income/schemas/income-schema";

export async function listCategories() {
  await requirePermission(PERMISSIONS.income.view);
  return incomeRepo.findManyCategories();
}

export async function createCategory(name: string) {
  await requirePermission(PERMISSIONS.income.create);
  return incomeRepo.createCategory(name);
}

export async function listIncomeForMonth(month: number, year: number) {
  await requirePermission(PERMISSIONS.income.view);
  return incomeRepo.findManyIncomeForMonth(month, year);
}

export async function createIncome(input: IncomeInput) {
  await requirePermission(PERMISSIONS.income.create);

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  const income = await incomeRepo.createIncome({
    categoryId: input.categoryId,
    amount: input.amount,
    source: input.source || null,
    description: input.description || null,
    date: input.date,
    createdById: session.user.id,
  });

  await logAudit({ action: "CREATE", entityType: "Income", entityId: income.id, after: { amount: input.amount, categoryId: input.categoryId } });
  return income;
}

export async function updateIncome(id: string, input: IncomeInput) {
  await requirePermission(PERMISSIONS.income.create);

  const before = await incomeRepo.findIncomeById(id);
  if (!before) throw new Error("Income not found.");

  const income = await incomeRepo.updateIncome(id, {
    categoryId: input.categoryId,
    amount: input.amount,
    source: input.source || null,
    description: input.description || null,
    date: input.date,
  });

  await logAudit({
    action: "UPDATE",
    entityType: "Income",
    entityId: id,
    before: { amount: before.amount.toString(), categoryId: before.categoryId },
    after: { amount: input.amount, categoryId: input.categoryId },
  });

  return income;
}

export async function deleteIncome(id: string) {
  await requirePermission(PERMISSIONS.income.create);

  const existing = await incomeRepo.findIncomeById(id);
  if (!existing) throw new Error("Income not found.");

  await incomeRepo.deleteIncome(id);
  await logAudit({ action: "DELETE", entityType: "Income", entityId: id, before: { amount: existing.amount.toString() } });
}
