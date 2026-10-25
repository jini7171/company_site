import { CitySystemVisual } from "@/components/subpage/HeroVisuals";
import { FeatureGrid } from "@/components/subpage/FeatureGrid";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { RelatedCards } from "@/components/subpage/RelatedCards";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { Metric } from "@/components/ui/Metric";
import { businessAreas } from "@/content/business";
import { companyIntro, companyMessage, companyPhilosophy } from "@/content/company";
import { companyMetrics, siteConfig } from "@/content/site";
import { technologies } from "@/content/technology";
import { pageMetadata } from "@/lib/seo";

const PATH = "/company/about";

export const metadata = pageMetadata({
  title: "회사소개",
  description: "2000년 설립 이후 스마트시티, AI, 데이터 기술로 도시의 문제를 해결해온 ESE를 소개합니다.",
  path: PATH,
});

const FACTS = [
  { label: "설립", value: "2000.04.24", en: "Founded" },
  { label: "임직원", value: siteConfig.employees, en: "Employees" },
  { label: "사업 분야", value: `${businessAreas.length}개 분야`, en: "Business Areas" },
  { label: "핵심 기술", value: `${technologies.length}개 영역`, en: "Core Technology" },
];

export default function AboutPage() {
  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="ABOUT ESE"
        title="회사소개"
        description="실제 도시 현장에서 쌓아온 경험을 바탕으로 스마트시티, AI, 데이터 기술을 연결합니다."
        graphic={<CitySystemVisual active={["infra", "data", "ai", "service"]} />}
      />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="OVERVIEW" title={companyMessage} description={companyIntro}>
        <dl className="grid grid-cols-2 border-t border-ink md:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="border-b border-line py-6 pr-4">
              <dt className="font-en text-eyebrow font-semibold uppercase text-muted">{fact.en}</dt>
              <dd className="mt-3">
                <span className="block text-[14px] text-muted">{fact.label}</span>
                <span className="mt-1 block font-en text-[24px] font-semibold tracking-[-0.03em]">{fact.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </SubSection>

      <SubSection index="02" eyebrow="OUR EXPERIENCE" title="숫자로 보는 ESE의 경험" tone="subtle">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {companyMetrics.map((metric, i) => (
            <Metric key={metric.unit} metric={metric} index={i} />
          ))}
        </div>
      </SubSection>

      <SubSection index="03" eyebrow="BUSINESS" title="ESE가 기술을 적용하는 다섯 가지 분야">
        <RelatedCards
          items={businessAreas.map((area) => ({ href: `/business/${area.slug}`, eyebrow: area.en, title: area.title, text: area.summary }))}
        />
      </SubSection>

      <SubSection index="04" eyebrow="TECHNOLOGY" title="사업을 만드는 세 가지 핵심 기술" tone="subtle">
        <RelatedCards
          items={technologies.map((tech) => ({
            href: `/technology/${tech.slug}`,
            eyebrow: tech.en,
            title: tech.title,
            text: tech.copy.replace("\n", " "),
          }))}
        />
      </SubSection>

      <SubSection index="05" eyebrow="PHILOSOPHY" title="ESE가 일하는 방식" tone="night">
        <FeatureGrid items={companyPhilosophy} columns={3} tone="dark" />
      </SubSection>

      <InquiryCTA />
    </>
  );
}
