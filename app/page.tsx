import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CodeEditorPanel } from "@/components/sections/CodeEditorPanel";
import { MembershipPlans } from "@/components/sections/MembershipPlans";
import { WhatWeOffer } from "@/components/sections/WhatWeOffer";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CompanyLogos } from "@/components/sections/CompanyLogos";
import { Mentors } from "@/components/sections/Mentors";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { OfferThemes } from "@/components/theme-gallery/OfferThemes";
import { ThemeStage } from "@/lib/theme/ThemeStage";

export default function Home() {
  return (
    <>
      <div className="relative">
        {/* Themes are confined to this band: navbar + hero only. */}
        <ThemeStage className="pointer-events-none absolute inset-0 overflow-hidden" />
        <Navbar />
        <Hero />
      </div>
      <main className="flex flex-1 flex-col">
        <OfferThemes />
        <CodeEditorPanel />
        <MembershipPlans />
        <WhatWeOffer />
        <WhyChooseUs />
        <CompanyLogos />
        <Mentors />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
