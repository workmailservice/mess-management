"use server";

import { revalidatePath } from "next/cache";
import * as settingsService from "@/features/settings/services/settings-service";
import { paymentSettingsSchema } from "@/features/settings/schemas/payment-settings-schema";
import type { PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";
import { businessProfileSchema } from "@/features/settings/schemas/business-profile-schema";
import type { BusinessProfileInput } from "@/features/settings/schemas/business-profile-schema";
import { saveUploadedImage, deleteUploadedImage } from "@/features/settings/lib/save-uploaded-image";

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

export async function getBusinessProfileAction() {
  return settingsService.getBusinessProfile();
}

export async function updateBusinessProfileAction(input: BusinessProfileInput) {
  const parsed = businessProfileSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await settingsService.updateBusinessProfile(parsed.data);
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function uploadBusinessImageAction(formData: FormData) {
  const kind = formData.get("kind");
  const file = formData.get("file");

  if (kind !== "hero" && kind !== "about") return { success: false as const, error: "Invalid image type." };
  if (!(file instanceof File) || file.size === 0) return { success: false as const, error: "Please choose an image file." };

  try {
    const previous = await settingsService.getBusinessProfile();
    const previousUrl = kind === "hero" ? previous?.heroImageUrl : previous?.aboutImageUrl;

    const url = await saveUploadedImage(file, kind);
    await settingsService.updateBusinessProfileImage(kind, url);
    if (previousUrl) await deleteUploadedImage(previousUrl);

    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true as const, url };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Upload failed." };
  }
}
