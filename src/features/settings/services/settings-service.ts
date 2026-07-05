import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as settingsRepo from "@/features/settings/repositories/settings-repository";
import type { PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";
import type { BusinessProfileInput } from "@/features/settings/schemas/business-profile-schema";

/** No permission check — read broadly by Billing/Payments to render QR codes. */
export async function getPaymentSettings() {
  return settingsRepo.getPaymentSettings();
}

export async function updatePaymentSettings(input: PaymentSettingsInput) {
  await requirePermission(PERMISSIONS.settings.manage);
  await settingsRepo.upsertPaymentSettings(input);
  await logAudit({ action: "UPDATE", entityType: "SystemSetting", entityId: settingsRepo.PAYMENT_SETTINGS_KEY, after: input });
}

/** No permission check — this is public marketing content rendered on the homepage. */
export async function getBusinessProfile() {
  return settingsRepo.getBusinessProfile();
}

export async function updateBusinessProfile(input: BusinessProfileInput) {
  await requirePermission(PERMISSIONS.settings.manage);
  const current = await settingsRepo.getBusinessProfile();
  const value = {
    ...input,
    mealTimings: input.mealTimings ?? "",
    email: input.email ?? "",
    heroImageUrl: current?.heroImageUrl ?? "",
    aboutImageUrl: current?.aboutImageUrl ?? "",
  };
  await settingsRepo.upsertBusinessProfile(value);
  await logAudit({ action: "UPDATE", entityType: "SystemSetting", entityId: settingsRepo.BUSINESS_PROFILE_KEY, after: value });
}

export async function updateBusinessProfileImage(kind: "hero" | "about", url: string) {
  await requirePermission(PERMISSIONS.settings.manage);
  const current = await settingsRepo.getBusinessProfile();
  const base: settingsRepo.BusinessProfileValue =
    current ?? { tagline: "", aboutText: "", rateDisplay: "", mealTimings: "", address: "", phone: "", email: "", heroImageUrl: "", aboutImageUrl: "" };
  const field = kind === "hero" ? "heroImageUrl" : "aboutImageUrl";
  const value = { ...base, [field]: url };
  await settingsRepo.upsertBusinessProfile(value);
  await logAudit({ action: "UPDATE", entityType: "SystemSetting", entityId: settingsRepo.BUSINESS_PROFILE_KEY, after: { [field]: url } });
  return value;
}
