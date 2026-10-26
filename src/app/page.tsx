import type { Metadata } from "next";
import { BusinessSection } from "@/components/home/BusinessSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { Hero } from "@/components/home/Hero";
import { SolutionSection } from "@/components/home/SolutionSection";
import { TechnologySection } from "@/components/home/TechnologySection";
import { siteConfig } from "@/content/site";

// 사업실적 건수(Supabase)를 60초마다 다시 가져옵니다.
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/**
 * Homepage Story
 * Who are we? → Why trust us? → What problems? → How? → What we provide → Work together
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <BusinessSection />
      <TechnologySection />
      <SolutionSection />
      <ContactCTA />
    </>
  );
}
