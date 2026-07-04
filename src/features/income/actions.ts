"use server";

import { revalidatePath } from "next/cache";
import * as incomeService from "@/features/income/services/income-service";
import { incomeSchema, categoryNameSchema } from "@/features/income/schemas/income-schema";
import type { IncomeInput } from "@/features/income/schemas/income-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getIncomeCategoriesAction() {
  return incomeService.listCategories();
}

export async function createIncomeCategoryAction(name: string) {
  const parsed = categoryNameSchema.safeParse({ name });
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    const category = await incomeService.createCategory(parsed.data.name);
    revalidatePath("/income");
    return { success: true as const, category };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function getIncomeForMonthAction(month: number, year: number) {
  const incomeRows = await incomeService.listIncomeForMonth(month, year);
  return incomeRows.map((income) => ({
    id: income.id,
    amount: income.amount.toString(),
    source: income.source,
    description: income.description,
    date: income.date.toISOString(),
    category: income.category,
  }));
}

export async function createIncomeAction(input: IncomeInput) {
  const parsed = incomeSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await incomeService.createIncome(parsed.data);
    revalidatePath("/income");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function updateIncomeAction(id: string, input: IncomeInput) {
  const parsed = incomeSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await incomeService.updateIncome(id, parsed.data);
    revalidatePath("/income");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function deleteIncomeAction(id: string) {
  try {
    await incomeService.deleteIncome(id);
    revalidatePath("/income");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
