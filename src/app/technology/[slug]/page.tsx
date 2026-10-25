import { notFound } from "next/navigation";
import type { HeroLayer } from "@/components/home/HeroGraphic";
import { FeatureGrid } from "@/components/subpage/FeatureGrid";
import { CitySystemVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { ProcessFlow } from "@/components/subpage/ProcessFlow";
import { RelatedCards } from "@/components/subpage/RelatedCards";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { businessAreas } from "@/content/business";
import { solutionFullName, solutions } from "@/content/solutions";
import { technologies } from "@/content/technology";
import { technologyDetails } from "@/content/technology-detail";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** 홈 Hero Graphic의 Layer와 기술을 연결 */
const LAYER_BY_TECH: Record<string, HeroLayer[]> = {
  ai: ["ai"],
  "big-data": ["data"],
  "smart-platform": ["infra", "service"],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tech = technologies.find((t) => t.slug === slug);
  if (!tech) return {};
  return pageMetadata({ title: tech.title, description: tech.copy.replace("\n", " "), path: `/technology/${slug}` });
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { slug } = await params;
  const tech = technologies.find((t) => t.slug === slug);
  const detail = technologyDetails[slug];
  if (!tech || !detail) notFound();

  const path = `/technology/${slug}`;
  const relatedBusiness = detail.applications
    .map((app) => ({ app, area: businessAreas.find((a) => a.slug === app.businessSlug) }))
    .filter((x) => x.area);
  const relatedSolutions = solutions.filter((s) => detail.relatedSolutions.includes(s.slug));

  return (
    <>
      <SubpageHero
        href={path}
        eyebrow={`CORE TECHNOLOGY · ${tech.en.toUpperCase()}`}
        title={<span className="font-en tracking-[-0.045em]">{tech.title}</span>}
        description={tech.copy.replace("\n", " ")}
        graphic={<CitySystemVisual active={LAYER_BY_TECH[slug] ?? ["ai"]} />}
      />
      <SubNav href={path} />

      <SubSection index="01" eyebrow="OVERVIEW" title="기술 개요" description={detail.overview}>
        <ul className="flex flex-wrap gap-2">
          {tech.keywords.map((k) => (
            <li key={k} className="border border-line px-4 py-2 font-en text-[13px] text-ink/70">
              {k}
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection index="02" eyebrow="CORE CAPABILITIES" title="핵심 역량" tone="subtle">
        <FeatureGrid items={detail.capabilities} />
      </SubSection>

      <SubSection index="03" eyebrow="ARCHITECTURE / PROCESS" title="기술이 작동하는 과정">
        <ProcessFlow steps={detail.process} />
      </SubSection>

      <SubSection index="04" eyebrow="APPLICATION AREAS" title="적용 분야" tone="night">
        <ul className="border-t border-white/15">
          {relatedBusiness.map(({ app, area }) => (
            <li key={app.businessSlug} className="grid gap-2 border-b border-white/15 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <span className="text-[18px] font-semibold">{area!.title}</span>
              <span className="text-[16px] text-white/70">{app.text}</span>
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection index="05" eyebrow="RELATED BUSINESS" title="이 기술이 적용되는 사업">
        <RelatedCards
          items={relatedBusiness.map(({ area }) => ({
            href: `/business/${area!.slug}`,
            eyebrow: area!.en,
            title: area!.title,
            text: area!.summary,
          }))}
        />
      </SubSection>

      <SubSection index="06" eyebrow="RELATED SOLUTION" title="이 기술을 담은 rino Solution" tone="subtle">
        <RelatedCards
          items={relatedSolutions.map((s) => ({ href: `/solution/${s.slug}`, eyebrow: s.label, title: solutionFullName(s), text: s.summary }))}
        />
      </SubSection>

      <InquiryCTA />
    </>
  );
}
