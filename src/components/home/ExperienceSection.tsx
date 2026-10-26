import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metric } from "@/components/ui/Metric";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { businessAreas } from "@/content/business";
import { getBusinessPerformance } from "@/content/projects";
import { companyMetrics } from "@/content/site";

export async function ExperienceSection() {
  const businessPerformance = await getBusinessPerformance();

  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-subtle py-24 md:py-28 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center lg:py-12">
      <div className="container max-w-content">
        <SectionHeader
          id="experience-title"
          index="01"
          eyebrow="OUR EXPERIENCE"
          title="경험으로 증명하는 ESE"
          aside={
            <p className="font-en text-eyebrow font-medium text-muted" aria-label="2000년 4월 24일 설립">
              SINCE 2000.04.24
            </p>
          }
        />

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 lg:mt-10 md:gap-8 lg:gap-12">
          {companyMetrics.map((metric, i) => (
            <Metric key={metric.unit} metric={metric} index={i} />
          ))}
        </div>

        {/* Business Performance — 관리자 페이지에서 등록한 프로젝트 수로 집계 */}
        <div className="mt-24 md:mt-28 lg:mt-10" data-reveal>
          <div className="flex flex-col gap-4 border-b border-ink pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">BUSINESS PERFORMANCE</p>
              <h3 className="mt-3 text-[22px] font-bold tracking-[-0.03em] md:text-[26px]">사업 분야별 수행 경험</h3>
            </div>
            <Link
              href="/business/performance"
              className="group inline-flex min-h-[44px] items-center gap-2 text-[14px] font-semibold text-ink hover:text-brand"
            >
              사업실적 자세히 보기
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul>
            {businessAreas.map((area) => {
              const performance = businessPerformance.find((p) => p.businessSlug === area.slug);
              const count = performance?.projectCount ?? null;
              return (
                <li key={area.slug} className="border-b border-line">
                  <Link
                    href={`/business/${area.slug}`}
                    className="group grid min-h-[76px] grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-4 lg:min-h-[48px] lg:py-1 transition-colors hover:bg-white md:grid-cols-[4rem_1fr_1fr_12rem_2rem] md:px-4"
                  >
                    <span className="font-en text-[13px] font-semibold text-muted">{area.index}</span>
                    <span className="text-[17px] font-semibold tracking-[-0.02em] md:text-[19px]">{area.title}</span>
                    <span className="hidden font-en text-[13px] uppercase tracking-[0.08em] text-muted md:block">{area.en}</span>
                    <span className="text-right">
                      {count !== null ? (
                        <span className="font-en text-[22px] font-semibold tabular-nums">
                          {count.toLocaleString("en-US")}
                          <span className="ml-1 text-[13px] text-muted">PROJECTS</span>
                        </span>
                      ) : (
                        <span className="text-[14px] font-semibold text-ink/70 transition-colors group-hover:text-brand">
                          바로가기
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="hidden h-4 w-4 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-brand md:block"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
