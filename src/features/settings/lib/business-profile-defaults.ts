import type { BusinessProfileInput } from "@/features/settings/schemas/business-profile-schema";

/** Placeholder content so the settings form and public homepage are never blank before an admin saves real details. */
export const BUSINESS_PROFILE_DEFAULTS: Required<BusinessProfileInput> = {
  tagline: "Home-style meals, made with care — delivered fresh, every single day.",
  aboutText:
    "RP Mess has been serving fresh, hygienic, and delicious home-style meals to students and working professionals. We take pride in quality ingredients, consistent taste, and timely service.",
  rateDisplay: "₹3,000 / month (Veg) · ₹3,500 / month (Non-Veg)",
  mealTimings: "Lunch: 1:00–3:00 PM · Dinner: 8:00–10:00 PM",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  phone: "+91 98765 43210",
  email: "contact@rpmess.com",
};

export const BUSINESS_NAME_DEFAULT = "RP Mess";
