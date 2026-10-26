import Image from "next/image";
import Link from "next/link";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { Placeholder } from "@/components/subpage/Placeholder";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { Metric } from "@/components/ui/Metric";
import { getProjects, projectCategories } from "@/content/projects";
import { companyMetrics } from "@/content/site";
import { technologies } from "@/content/technology";
import { pageMetadata } from "@/lib/seo";

const PATH = "/business/performance";

// 관리자 페이지에서 등록한 프로젝트(Supabase)를 60초마다 다시 가져옵니다.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "사업실적",
  description: "2,000건 이상의 프로젝트와 1,400곳 이상의 공공·민간 레퍼런스로 증명한 ESE의 사업 경험입니다.",
  path: PATH,
});

const formatMonth = (date?: string) => (date ? date.slice(0, 7).replace("-", ".") : "");

export default async function PerformancePage() {
  const projects = await getProjects();

  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="BUSINESS PERFORMANCE"
        title="사업실적"
        description="2000년부터 이어온 프로젝트 경험을 사업 분야별로 소개합니다."
      />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="OVERVIEW" title="숫자로 보는 사업 경험">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {companyMetrics.map((metric, i) => (
            <Metric key={metric.unit} metric={metric} index={i} />
          ))}
        </div>
      </SubSection>

      <SubSection index="02" eyebrow="BY BUSINESS" title="분야별 수행 실적" tone="subtle">
        <ul className="border-t border-ink">
          {projectCategories.map((c, i) => {
            const count = projects.filter((p) => p.category === c.label).length;
            const row = (
              <>
                <span className="font-en text-[13px] font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[18px] font-semibold tracking-[-0.02em]">{c.label}</span>
                <span className="text-right">
                  {count > 0 ? (
                    <span className="font-en text-[22px] font-semibold tabular-nums">{count.toLocaleString("en-US")}</span>
                  ) : (
                    <span className="text-[14px] text-muted">집계 중</span>
                  )}
                </span>
              </>
            );
            const cls = "grid min-h-[72px] grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[4rem_1fr_10rem] md:px-4";
            return (
              <li key={c.label} className="border-b border-line">
                {"businessSlug" in c ? (
                  <Link href={`/business/${c.businessSlug}`} className={`${cls} transition-colors hover:bg-white`}>
                    {row}
                  </Link>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </SubSection>

      <SubSection index="03" eyebrow="PROJECTS" title="주요 수행 프로젝트">
        {projects.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.id} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden border border-line bg-subtle">
                  <Image src={p.imageUrl} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-5 text-[13px] font-semibold text-brand">{p.category}</p>
                <h3 className="mt-2 text-[19px] font-bold leading-[1.4] tracking-[-0.02em]">{p.title}</h3>
                {p.content && <p className="mt-3 line-clamp-3 whitespace-pre-line text-[15px] leading-[1.7] text-muted">{p.content}</p>}
                {(p.startDate || p.endDate) && (
                  <p className="mt-4 border-t border-line pt-4 text-[13px] text-ink/70">
                    <span className="mr-2 text-muted">구축기간</span>
                    <span className="font-en tabular-nums">
                      {formatMonth(p.startDate)} – {formatMonth(p.endDate)}
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>주요 수행 프로젝트를 정리하고 있습니다.</Placeholder>
        )}
      </SubSection>

      <SubSection index="04" eyebrow="CAPABILITY AREAS" title="실적을 만든 핵심 역량" tone="night">
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
