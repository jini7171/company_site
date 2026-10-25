import { Plus } from "lucide-react";
import { CitySystemVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { coreValues, vision } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

const PATH = "/company/vision";

export const metadata = pageMetadata({
  title: "비전 · 핵심가치",
  description: "Smart City, AI, Data를 연결해 더 스마트한 도시의 내일을 만드는 ESE의 비전과 핵심가치입니다.",
  path: PATH,
});

const PILLARS = [
  { en: "SMART CITY", text: "도시를 이해하는 경험" },
  { en: "AI", text: "더 나은 판단을 돕는 지능" },
  { en: "DATA", text: "모든 것을 잇는 기반" },
];

export default function VisionPage() {
  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="VISION & VALUES"
        title="비전 · 핵심가치"
        description={vision.text}
        graphic={<CitySystemVisual active={["data", "ai"]} />}
      />
      <SubNav href={PATH} />

      <SubSection
        index="01"
        eyebrow="VISION"
        title={vision.headline.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        description={<span className="font-en font-semibold tracking-[-0.01em] text-brand">{vision.statement}</span>}
      >
        <ul className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {PILLARS.map((p, i) => (
            <li key={p.en} className="flex flex-1 items-center gap-4">
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-full border border-brand/40 bg-brand-50/40 p-6 text-center">
                <span className="font-en text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.03em] text-brand">{p.en}</span>
                <span className="mt-2 text-[15px] text-muted">{p.text}</span>
              </div>
              {i < PILLARS.length - 1 && (
                <Plus aria-hidden="true" className="hidden h-6 w-6 shrink-0 text-ink/30 md:block" />
              )}
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection index="02" eyebrow="CORE VALUES" title="ESE가 지키는 네 가지 가치" tone="subtle">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, i) => (
            <li key={value.en} className="group flex min-h-[260px] flex-col bg-white p-7 transition-colors duration-500 hover:bg-brand-50/50">
              <span className="font-en text-[13px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-auto pt-10 font-en text-[28px] font-semibold tracking-[-0.04em]">{value.en}</span>
              <h3 className="mt-1 text-[17px] font-bold text-ink/80">{value.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </SubSection>

      <InquiryCTA />
    </>
  );
}
