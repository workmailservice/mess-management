"use server";

import * as billingService from "@/features/billing/services/billing-service";
import { generateInvoicesSchema } from "@/features/billing/schemas/billing-schema";
import type { GenerateInvoicesInput } from "@/features/billing/schemas/billing-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getInvoicesForMonthAction(month: number, year: number) {
  return billingService.listInvoicesForMonth(month, year);
}

export async function getInvoiceDetailAction(id: string) {
  return billingService.getInvoiceDetail(id);
}

export async function generateInvoicesAction(input: GenerateInvoicesInput) {
  const parsed = generateInvoicesSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    const result = await billingService.generateInvoicesForMonth(parsed.data);
    return { success: true as const, ...result };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
