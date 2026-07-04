"use server";

import { revalidatePath } from "next/cache";
import * as settingsService from "@/features/settings/services/settings-service";
import { paymentSettingsSchema } from "@/features/settings/schemas/payment-settings-schema";
import type { PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";

export async function getPaymentSettingsAction() {
  return settingsService.getPaymentSettings();
}

export async function updatePaymentSettingsAction(input: PaymentSettingsInput) {
  const parsed = paymentSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await settingsService.updatePaymentSettings(parsed.data);
    revalidatePath("/settings");
    revalidatePath("/billing");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
