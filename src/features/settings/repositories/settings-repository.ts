import { prisma } from "@/lib/prisma";

export const PAYMENT_SETTINGS_KEY = "payment_settings";

export interface PaymentSettingsValue {
  businessName: string;
  upiId: string;
  // Index signature required for structural compatibility with Prisma's Json input type.
  [key: string]: string;
}

export async function getPaymentSettings(): Promise<PaymentSettingsValue | null> {
  const row = await prisma.systemSetting.findUnique({ where: { key: PAYMENT_SETTINGS_KEY } });
  return (row?.value as PaymentSettingsValue | undefined) ?? null;
}

export function upsertPaymentSettings(value: PaymentSettingsValue) {
  return prisma.systemSetting.upsert({
    where: { key: PAYMENT_SETTINGS_KEY },
    update: { value },
    create: { key: PAYMENT_SETTINGS_KEY, value },
  });
}

export const BUSINESS_PROFILE_KEY = "business_profile";

export interface BusinessProfileValue {
  tagline: string;
  aboutText: string;
  rateDisplay: string;
  mealTimings: string;
  address: string;
  phone: string;
  email: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  // Index signature required for structural compatibility with Prisma's Json input type.
  [key: string]: string;
}

export async function getBusinessProfile(): Promise<BusinessProfileValue | null> {
  const row = await prisma.systemSetting.findUnique({ where: { key: BUSINESS_PROFILE_KEY } });
  return (row?.value as BusinessProfileValue | undefined) ?? null;
}

export function upsertBusinessProfile(value: BusinessProfileValue) {
  return prisma.systemSetting.upsert({
    where: { key: BUSINESS_PROFILE_KEY },
    update: { value },
    create: { key: BUSINESS_PROFILE_KEY, value },
  });
}
