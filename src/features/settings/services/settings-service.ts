import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as settingsRepo from "@/features/settings/repositories/settings-repository";
import type { PaymentSettingsInput } from "@/features/settings/schemas/payment-settings-schema";

/** No permission check — read broadly by Billing/Payments to render QR codes. */
export async function getPaymentSettings() {
  return settingsRepo.getPaymentSettings();
}

export async function updatePaymentSettings(input: PaymentSettingsInput) {
  await requirePermission(PERMISSIONS.settings.manage);
  await settingsRepo.upsertPaymentSettings(input);
  await logAudit({ action: "UPDATE", entityType: "SystemSetting", entityId: settingsRepo.PAYMENT_SETTINGS_KEY, after: input });
}
