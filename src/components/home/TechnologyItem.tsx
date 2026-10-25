import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Technology } from "@/content/types";

type TechnologyItemProps = {
  tech: Technology;
  index: number;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

/**
 * Rail 위 Node + 아래 Card 구조
 * Card 전체가 상세 페이지 링크이며, Hover/Focus 시 Node·Rail·Card가 함께 강조됩니다.
 */
export function TechnologyItem({ tech, index, active, dimmed, onActivate, onDeactivate }: TechnologyItemProps) {
  return (
    <article
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={`relative flex gap-5 pb-8 transition-opacity duration-500 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0 ${
        dimmed ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Node */}
      <div className="relative flex flex-col items-center lg:items-start">
        <span
          aria-hidden="true"
          className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
            active ? "border-cyan bg-cyan text-night" : "border-white/30 bg-night text-white/70"
          }`}
        >
          <span
            className={`absolute inset-[-9px] rounded-full border transition-opacity duration-500 ${active ? "border-cyan/40 opacity-100" : "opacity-0"}`}
          />
          <span className="font-en text-[13px] font-semibold">{String(index + 1).padStart(2, "0")}</span>
        </span>
        {/* Node → Card 연결선 (Mobile에서는 다음 Node까지 이어지는 세로 Rail) */}
        <span
          aria-hidden="true"
          className={`relative mt-2 w-px flex-1 transition-colors duration-500 lg:ml-7 lg:mt-0 lg:h-6 lg:flex-none ${
            active ? "bg-cyan" : "bg-white/15"
          }`}
        >
          <span className="flow-rail flow-rail-vertical absolute inset-0 text-cyan/70 motion-reduce:hidden lg:hidden" />
        </span>
      </div>

      {/* Card */}
      <div
        className={`relative flex flex-1 flex-col overflow-hidden border p-7 transition-all duration-500 ease-editorial md:p-8 ${
          active
            ? "-translate-y-1.5 border-cyan/70 bg-[#13254A] shadow-[0_32px_64px_-32px_rgba(14,165,198,0.55)]"
            : "border-white/10 bg-white/[0.03]"
        }`}
      >
        {/* 상단 Accent Bar */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[3px] origin-left bg-gradient-to-r from-cyan to-brand-400 transition-transform duration-700 ease-editorial ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />

        <p className={`font-en text-eyebrow font-semibold transition-colors duration-500 ${active ? "text-cyan" : "text-white/45"}`}>
          {tech.en.toUpperCase()}
        </p>
        <h3 className="mt-3 font-en text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-none tracking-[-0.045em] text-white">
          {tech.title}
        </h3>
        <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.7] text-white/70">{tech.copy}</p>

        {tech.capabilities && (
          <ol className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-en text-[12px] text-white/60" aria-label="Big Data Capabilities">
            {tech.capabilities.map((cap, i) => (
              <li key={cap} className="flex items-center gap-1.5">
                <span className={`border px-2 py-1 transition-colors duration-500 ${active ? "border-cyan/40 text-white/85" : "border-white/15"}`}>
                  {cap}
                </span>
                {i < tech.capabilities!.length - 1 && <span aria-hidden="true" className="text-cyan/70">→</span>}
              </li>
            ))}
          </ol>
        )}

        <ul className="mt-5 grid grid-cols-2 border-t border-white/10">
          {tech.keywords.map((k) => (
            <li key={k} className="border-b border-white/10 py-2.5 font-en text-[13px] font-medium tracking-[0.02em] text-white/80">
              <span className={`mr-2 inline-block h-1 w-1 align-middle transition-colors ${active ? "bg-cyan" : "bg-white/40"}`} />
              {k}
            </li>
          ))}
        </ul>

        {/* Card 전체를 덮는 링크 (after:inset-0) */}
        <Link
          href={`/technology/${tech.slug}`}
          className={`mt-auto inline-flex min-h-[44px] items-center gap-2 pt-5 text-[14px] font-semibold transition-colors after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-cyan ${
            active ? "text-cyan" : "text-white"
          }`}
        >
          {tech.title} 기술 자세히 보기
          <ArrowRight
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-500 ${active ? "translate-x-1.5" : ""}`}
          />
        </Link>
      </div>
    </article>
  );
}
