import "server-only";
import { getBusinessProfile, getPaymentSettings } from "@/features/settings/services/settings-service";
import { getPublicActiveCustomerCount } from "@/features/customers/services/customer-service";
import { BUSINESS_PROFILE_DEFAULTS, BUSINESS_NAME_DEFAULT } from "@/features/settings/lib/business-profile-defaults";

export interface HomeData {
  businessName: string;
  tagline: string;
  aboutText: string;
  rateDisplay: string;
  mealTimings: string;
  address: string;
  phone: string;
  email: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  customerCount: number;
}

function pick(value: string | undefined, fallback: string): string {
  return value || fallback;
}

/** Public marketing content for the homepage — falls back to placeholder text until an admin saves real details in Settings. */
export async function getHomeData(): Promise<HomeData> {
  const [profile, paymentSettings, customerCount] = await Promise.all([
    getBusinessProfile(),
    getPaymentSettings(),
    getPublicActiveCustomerCount(),
  ]);

  return {
    businessName: pick(paymentSettings?.businessName, BUSINESS_NAME_DEFAULT),
    tagline: pick(profile?.tagline, BUSINESS_PROFILE_DEFAULTS.tagline),
    aboutText: pick(profile?.aboutText, BUSINESS_PROFILE_DEFAULTS.aboutText),
    rateDisplay: pick(profile?.rateDisplay, BUSINESS_PROFILE_DEFAULTS.rateDisplay),
    mealTimings: pick(profile?.mealTimings, BUSINESS_PROFILE_DEFAULTS.mealTimings),
    address: pick(profile?.address, BUSINESS_PROFILE_DEFAULTS.address),
    phone: pick(profile?.phone, BUSINESS_PROFILE_DEFAULTS.phone),
    email: pick(profile?.email, BUSINESS_PROFILE_DEFAULTS.email),
    heroImageUrl: profile?.heroImageUrl ?? "",
    aboutImageUrl: profile?.aboutImageUrl ?? "",
    customerCount,
  };
}
