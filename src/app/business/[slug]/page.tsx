import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeatureGrid } from "@/components/subpage/FeatureGrid";
import { BusinessVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { Placeholder } from "@/components/subpage/Placeholder";
import { RelatedCards } from "@/components/subpage/RelatedCards";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { businessAreas, getBusinessArea } from "@/content/business";
import { businessDetails } from "@/content/business-detail";
import { getBusinessPerformance } from "@/content/projects";
import { solutionFullName, solutions } from "@/content/solutions";
import { technologies } from "@/content/technology";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 60;

export function generateStaticParams() {
  return businessAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const area = getBusinessArea(slug);
  if (!area) return {};
  return pageMetadata({ title: area.title, description: area.summary, path: `/business/${slug}` });
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = getBusinessArea(slug);
  const detail = businessDetails[slug];
  if (!area || !detail) notFound();

  const path = `/business/${slug}`;
  const performance = (await getBusinessPerformance()).find((p) => p.businessSlug === slug);
  const relatedTech = technologies.filter((t) => detail.relatedTechnologies.includes(t.slug));
  const relatedSolutions = solutions.filter((s) => detail.relatedSolutions.includes(s.slug));

  return (
    <>
      <SubpageHero
        href={path}
        eyebrow={`${area.index} · ${area.en.toUpperCase()}`}
        title={area.title}
        description={area.summary}
        graphic={<BusinessVisual kind={area.graphic} />}
      />
      <SubNav href={path} />

      <SubSection index="01" eyebrow="OVERVIEW" title="사업 개요" description={detail.overview}>
        <ul className="flex flex-wrap gap-2">
          {area.keywords.map((k) => (
            <li key={k} className="border border-line px-4 py-2 font-en text-[13px] text-ink/70">
              {k}
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection index="02" eyebrow="CHALLENGES" title="도시가 마주한 과제" tone="subtle">
        <FeatureGrid items={detail.challenges} columns={3} />
      </SubSection>

      <SubSection index="03" eyebrow="CAPABILITIES" title="ESE의 해결 역량">
        <FeatureGrid items={detail.capabilities} />
      </SubSection>

      <SubSection index="04" eyebrow="KEY SERVICE AREAS" title="주요 서비스 영역" tone="night">
        <ul className="border-t border-white/15">
          {detail.services.map((service, i) => (
            <li key={service} className="flex items-baseline gap-6 border-b border-white/15 py-5">
              <span className="font-en text-[13px] font-semibold text-cyan">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-[-0.02em]">{service}</span>
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection index="05" eyebrow="EXPERIENCE" title={`${area.title} 수행 경험`} tone="subtle">
        <dl className="grid border-t border-ink md:grid-cols-2">
          <div className="border-b border-line py-6 md:pr-6">
            <dt className="font-en text-eyebrow font-semibold uppercase text-muted">Projects</dt>
            <dd className="mt-3 font-en text-[clamp(2.5rem,4vw,3.5rem)] font-semibold tracking-[-0.04em]">
              {performance?.projectCount != null ? (
                performance.projectCount.toLocaleString("en-US")
              ) : (
                <span className="text-[17px] font-normal tracking-normal text-muted">수행 실적 집계 중</span>
              )}
            </dd>
          </div>
          <div className="border-b border-line py-6">
            <dt className="font-en text-eyebrow font-semibold uppercase text-muted">Latest Project</dt>
            <dd className="mt-3 text-[17px]">
              {performance?.latestTitle ?? <span className="text-muted">프로젝트 정보 준비 중</span>}
            </dd>
          </div>
        </dl>
        <Link
          href="/business/performance"
          className="group mt-8 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold hover:text-brand"
        >
          전체 사업실적 보기
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </SubSection>

      <SubSection index="06" eyebrow="RELATED TECHNOLOGY" title="이 사업을 만드는 기술">
        <RelatedCards
          items={relatedTech.map((t) => ({ href: `/technology/${t.slug}`, eyebrow: t.en, title: t.title, text: t.copy.replace("\n", " ") }))}
        />
      </SubSection>

      <SubSection index="07" eyebrow="RELATED SOLUTION" title="함께 쓰이는 rino Solution" tone="subtle">
        {relatedSolutions.length > 0 ? (
          <RelatedCards
            items={relatedSolutions.map((s) => ({ href: `/solution/${s.slug}`, eyebrow: s.label, title: solutionFullName(s), text: s.summary }))}
          />
        ) : (
          <Placeholder />
        )}
      </SubSection>

      <InquiryCTA />
    </>
  );
}
