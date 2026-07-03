"use server";

import { revalidatePath } from "next/cache";
import * as customerService from "@/features/customers/services/customer-service";
import { customerSchema } from "@/features/customers/schemas/customer-schema";
import type { CustomerInput } from "@/features/customers/schemas/customer-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getCustomersAction() {
  const customers = await customerService.listCustomers();
  // Prisma's Decimal instances aren't safely serializable across the Server Action boundary.
  return customers.map((customer) => ({ ...customer, monthlyRate: customer.monthlyRate.toString() }));
}

export async function createCustomerAction(input: CustomerInput) {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await customerService.createCustomer(parsed.data);
    revalidatePath("/customers");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function updateCustomerAction(id: string, input: CustomerInput) {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await customerService.updateCustomer(id, parsed.data);
    revalidatePath("/customers");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    await customerService.deleteCustomer(id);
    revalidatePath("/customers");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
