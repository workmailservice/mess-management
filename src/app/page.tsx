import type { Metadata } from "next";
import { HomePage } from "@/features/home/components/home-page";

// Always render fresh per request — this reads live Settings data (business profile,
// customer count), so it must never be frozen as a build-time static snapshot.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RP Mess — Home-style tiffin service",
  description: "Fresh, hygienic home-style meals delivered daily. Rates, timings, and contact details.",
};

export default function RootPage() {
  return <HomePage />;
}
