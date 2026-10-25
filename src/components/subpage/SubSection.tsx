import type { ReactNode } from "react";

type Tone = "white" | "subtle" | "night";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  subtle: "bg-subtle text-ink",
  night: "bg-night text-white",
};

type SubSectionProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
};

/**
 * Subpage 공통 Section
 * 좌측 Index·Eyebrow / 우측 제목·본문 — 홈 SectionHeader와 같은 Editorial 구조를 작은 크기로 사용합니다.
 */
export function SubSection({ index, eyebrow, title, description, tone = "white", children }: SubSectionProps) {
  const dark = tone === "night";

  return (
    <section className={`py-20 md:py-28 ${tones[tone]}`}>
      <div className="container grid max-w-content gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex items-center gap-4 lg:col-span-3 lg:items-start lg:pt-2" data-reveal>
          {index && <span className={`font-en text-eyebrow font-semibold ${dark ? "text-white/40" : "text-muted"}`}>{index}</span>}
          <span aria-hidden="true" className={`h-px w-10 lg:mt-[7px] ${dark ? "bg-white/25" : "bg-ink/20"}`} />
          <p className={`eyebrow ${dark ? "text-cyan" : ""}`}>{eyebrow}</p>
        </div>
        <div className="lg:col-span-9">
          <h2 className="font-kr text-[clamp(1.625rem,2.8vw,2.375rem)] font-bold leading-[1.3] tracking-[-0.03em]" data-reveal>
            {title}
          </h2>
          {description && (
            <p className={`mt-5 max-w-[640px] text-base leading-[1.8] md:text-[17px] ${dark ? "text-white/65" : "text-muted"}`} data-reveal>
              {description}
            </p>
          )}
          {children && (
            <div className="mt-10 md:mt-14" data-reveal>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
