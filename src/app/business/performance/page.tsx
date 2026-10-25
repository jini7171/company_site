import Link from "next/link";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { Placeholder } from "@/components/subpage/Placeholder";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { Metric } from "@/components/ui/Metric";
import { businessAreas, businessPerformance } from "@/content/business";
import { companyMetrics } from "@/content/site";
import { technologies } from "@/content/technology";
import { pageMetadata } from "@/lib/seo";

const PATH = "/business/performance";

export const metadata = pageMetadata({
  title: "사업실적",
  description: "2,000건 이상의 프로젝트와 1,400곳 이상의 공공·민간 레퍼런스로 증명한 ESE의 사업 경험입니다.",
  path: PATH,
});

export default function PerformancePage() {
  const allRegions = Array.from(new Set(businessPerformance.flatMap((p) => p.regions)));

  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="BUSINESS PERFORMANCE"
        title="사업실적"
        description="2000년부터 이어온 프로젝트 경험을 사업 분야, 지역, 역량 기준으로 소개합니다."
      />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="OVERVIEW" title="숫자로 보는 사업 경험">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {companyMetrics.map((metric, i) => (
            <Metric key={metric.unit} metric={metric} index={i} />
          ))}
        </div>
      </SubSection>

      <SubSection index="02" eyebrow="BY BUSINESS" title="사업 분야별 수행 실적" tone="subtle">
        <ul className="border-t border-ink">
          {businessAreas.map((area) => {
            const count = businessPerformance.find((p) => p.businessSlug === area.slug)?.projectCount ?? null;
            return (
              <li key={area.slug} className="border-b border-line">
                <Link
                  href={`/business/${area.slug}`}
                  className="group grid min-h-[72px] grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-white md:grid-cols-[4rem_1fr_1fr_10rem] md:px-4"
                >
                  <span className="font-en text-[13px] font-semibold text-muted">{area.index}</span>
                  <span className="text-[18px] font-semibold tracking-[-0.02em]">{area.title}</span>
                  <span className="hidden font-en text-[13px] uppercase tracking-[0.08em] text-muted md:block">{area.en}</span>
                  <span className="text-right">
                    {count !== null ? (
                      <span className="font-en text-[22px] font-semibold tabular-nums">{count.toLocaleString("en-US")}</span>
                    ) : (
                      <span className="text-[14px] text-muted">집계 중</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </SubSection>

      <SubSection index="03" eyebrow="BY REGION" title="지역별 수행 현황">
        {allRegions.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {allRegions.map((r) => (
              <li key={r} className="border border-line px-4 py-2 text-[15px]">
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>지역별 수행 현황을 정리하고 있습니다.</Placeholder>
        )}
      </SubSection>

      <SubSection index="04" eyebrow="BY PROJECT TYPE" title="프로젝트 유형" tone="subtle">
        {/* TODO: 구축·운영·유지보수·컨설팅 등 확정된 유형별 실적 입력 */}
        <Placeholder>프로젝트 유형별 실적을 정리하고 있습니다.</Placeholder>
      </SubSection>

      <SubSection index="05" eyebrow="CAPABILITY AREAS" title="실적을 만든 핵심 역량" tone="night">
        <ul className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {technologies.map((t) => (
            <li key={t.slug}>
              <Link href={`/technology/${t.slug}`} className="flex h-full flex-col bg-night p-7 transition-colors hover:bg-night-700">
                <span className="font-en text-eyebrow font-semibold uppercase text-cyan">{t.en}</span>
                <span className="mt-6 font-en text-[28px] font-semibold tracking-[-0.04em]">{t.title}</span>
                <span className="mt-3 whitespace-pre-line text-[15px] leading-[1.7] text-white/65">{t.copy}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SubSection>

      <InquiryCTA />
    </>
  );
}
