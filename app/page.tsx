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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
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
