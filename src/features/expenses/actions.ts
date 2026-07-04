"use server";

import { revalidatePath } from "next/cache";
import * as expenseService from "@/features/expenses/services/expense-service";
import { expenseSchema, categoryNameSchema } from "@/features/expenses/schemas/expense-schema";
import type { ExpenseInput } from "@/features/expenses/schemas/expense-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getExpenseCategoriesAction() {
  return expenseService.listCategories();
}

export async function createExpenseCategoryAction(name: string) {
  const parsed = categoryNameSchema.safeParse({ name });
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    const category = await expenseService.createCategory(parsed.data.name);
    revalidatePath("/expenses");
    return { success: true as const, category };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function getExpensesForMonthAction(month: number, year: number) {
  const expenses = await expenseService.listExpensesForMonth(month, year);
  return expenses.map((expense) => ({
    id: expense.id,
    amount: expense.amount.toString(),
    description: expense.description,
    vendorName: expense.vendorName,
    paymentMethod: expense.paymentMethod,
    date: expense.date.toISOString(),
    category: expense.category,
  }));
}

export async function createExpenseAction(input: ExpenseInput) {
  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await expenseService.createExpense(parsed.data);
    revalidatePath("/expenses");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function updateExpenseAction(id: string, input: ExpenseInput) {
  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await expenseService.updateExpense(id, parsed.data);
    revalidatePath("/expenses");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function deleteExpenseAction(id: string) {
  try {
    await expenseService.deleteExpense(id);
    revalidatePath("/expenses");
    revalidatePath("/reports");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
