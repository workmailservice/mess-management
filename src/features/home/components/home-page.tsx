import { getHomeData } from "@/features/home/lib/get-home-data";
import { SiteHeader } from "@/features/home/components/site-header";
import { HeroSection } from "@/features/home/components/hero-section";
import { FeaturesGridSection } from "@/features/home/components/features-grid-section";
import { AboutSection } from "@/features/home/components/about-section";
import { RatesSection } from "@/features/home/components/rates-section";
import { CtaBannerSection } from "@/features/home/components/cta-banner-section";
import { ContactSection } from "@/features/home/components/contact-section";
import { SiteFooter } from "@/features/home/components/site-footer";

export async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader businessName={data.businessName} />
      <main className="flex-1">
        <HeroSection businessName={data.businessName} tagline={data.tagline} heroImageUrl={data.heroImageUrl} />
        <FeaturesGridSection />
        <AboutSection aboutText={data.aboutText} aboutImageUrl={data.aboutImageUrl} customerCount={data.customerCount} />
        <RatesSection rateDisplay={data.rateDisplay} mealTimings={data.mealTimings} />
        <CtaBannerSection businessName={data.businessName} />
        <ContactSection
          businessName={data.businessName}
          address={data.address}
          phone={data.phone}
          email={data.email}
        />
      </main>
      <SiteFooter businessName={data.businessName} />
    </div>
  );
}
