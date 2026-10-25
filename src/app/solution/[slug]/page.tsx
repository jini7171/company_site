import { notFound } from "next/navigation";
import { FeatureGrid } from "@/components/subpage/FeatureGrid";
import { ProductVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { Placeholder } from "@/components/subpage/Placeholder";
import { RelatedCards } from "@/components/subpage/RelatedCards";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { businessAreas } from "@/content/business";
import { solutionDetails } from "@/content/solution-detail";
import { solutionFullName, solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const PENDING_MESSAGE = "제품 정보를 준비하고 있습니다. 자세한 내용은 사업 문의로 요청해 주세요.";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const solution = solutions.find((s) => s.slug === slug);
  if (!solution) return {};
  return pageMetadata({
    title: solutionFullName(solution),
    description: `${solutionFullName(solution)} — 도시 운영을 위한 ESE의 rino Solution`,
    path: `/solution/${slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = solutions.find((s) => s.slug === slug);
  const detail = solutionDetails[slug];
  if (!solution || !detail) notFound();

  const path = `/solution/${slug}`;
  const relatedBusiness = businessAreas.filter((a) => detail.relatedBusiness.includes(a.slug));
  const otherSolutions = solutions.filter((s) => s.slug !== slug);
  const index = solutions.indexOf(solution);

  return (
    <>
      <SubpageHero
        href={path}
        eyebrow={`RINO SOLUTION · ${String(index + 1).padStart(2, "0")} / ${String(solutions.length).padStart(2, "0")}`}
        title={<span className="font-en tracking-[-0.045em]">{solutionFullName(solution)}</span>}
        description={detail.overview ?? solution.summary}
        graphic={<ProductVisual name={solution.name} label={solution.label} />}
      />
      <SubNav href={path} />

      <SubSection index="01" eyebrow="PRODUCT OVERVIEW" title="제품 개요" description={detail.overview ?? undefined}>
        {!detail.overview && <Placeholder>{PENDING_MESSAGE}</Placeholder>}
      </SubSection>

      <SubSection index="02" eyebrow="KEY FEATURES" title="주요 기능" tone="subtle">
        {detail.features.length > 0 ? <FeatureGrid items={detail.features} /> : <Placeholder>{PENDING_MESSAGE}</Placeholder>}
      </SubSection>

      <SubSection index="03" eyebrow="SYSTEM ARCHITECTURE" title="시스템 구성" tone="night">
        {detail.architecture ? (
          <ol className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {detail.architecture.map((layer, i) => (
              <li key={layer.en} className="relative bg-night p-7">
                <span className="font-en text-[13px] font-semibold text-cyan">
                  {String(i + 1).padStart(2, "0")} · {layer.en.toUpperCase()}
                </span>
                <h3 className="mt-5 text-[20px] font-bold">{layer.layer}</h3>
                <ul className="mt-5 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="border border-white/15 px-3 py-2 text-[14px] text-white/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <Placeholder tone="dark">시스템 구성도를 준비하고 있습니다.</Placeholder>
        )}
      </SubSection>

      <SubSection index="04" eyebrow="USE CASES" title="활용 사례">
        {detail.useCases.length > 0 ? (
          <ul className="border-t border-ink">
            {detail.useCases.map((u, i) => (
              <li key={u} className="flex items-baseline gap-6 border-b border-line py-5">
                <span className="font-en text-[13px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[18px] font-semibold tracking-[-0.02em]">{u}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>{PENDING_MESSAGE}</Placeholder>
        )}
      </SubSection>

      <SubSection index="05" eyebrow="RELATED BUSINESS" title="이 제품이 쓰이는 사업" tone="subtle">
        {relatedBusiness.length > 0 ? (
          <RelatedCards
            items={relatedBusiness.map((a) => ({ href: `/business/${a.slug}`, eyebrow: a.en, title: a.title, text: a.summary }))}
          />
        ) : (
          <Placeholder>{PENDING_MESSAGE}</Placeholder>
        )}
      </SubSection>

      <SubSection index="06" eyebrow="RELATED SOLUTION" title="다른 rino Solution">
        <RelatedCards
          items={otherSolutions.map((s) => ({ href: `/solution/${s.slug}`, eyebrow: s.label, title: solutionFullName(s) }))}
        />
      </SubSection>

      <InquiryCTA />
    </>
  );
}
