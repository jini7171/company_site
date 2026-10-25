"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { inquiryHref } from "@/content/navigation";
import { HeroGraphic, type HeroLayer } from "./HeroGraphic";

/** Typography Keyword ↔ Graphic Layer 연결 */
const KEYWORDS: { label: string; layers: HeroLayer[] }[] = [
  { label: "SMART CITY", layers: ["infra", "service"] },
  { label: "AI", layers: ["ai"] },
  { label: "DATA", layers: ["data"] },
];

const FLOW = ["Infrastructure", "Data", "AI", "Service"];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((i) => (i + 1) % KEYWORDS.length), 3200);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  // 마우스 위치에 따라 AI Node Layer가 아주 미세하게 반응합니다.
  useEffect(() => {
    const el = graphicRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const selectKeyword = (index: number) => {
    setAutoPlay(false);
    setActiveIndex(index);
  };

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-night text-white lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col">
      {/* Spatial Grid Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_10%,transparent_85%)]">
        <div className="absolute inset-y-0 left-0 right-[-80px] opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px] motion-safe:animate-grid-drift" />
        {/* 은은한 Cobalt 빛 번짐 */}
        <div className="absolute -right-40 top-0 h-[640px] w-[640px] rounded-full bg-brand/15 blur-[140px]" />
      </div>

      <div className="container relative max-w-content pb-12 pt-10 md:pt-14 lg:flex lg:flex-1 lg:flex-col lg:pb-8 lg:pt-0">
        {/* Main Copy + Graphic — Desktop에서는 남은 높이의 세로 가운데에 배치 */}
        <div className="grid gap-12 lg:flex-1 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-8">
          <div className="relative z-10 pt-6 md:pt-12 lg:col-span-8 lg:pt-0">
            <h1
              id="hero-title"
              className="font-kr text-[clamp(2.5rem,4.6vw,4.5rem)] font-bold leading-[1.16] tracking-[-0.04em]"
            >
              <span className="block opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100 [animation-delay:120ms]">
                <span className="text-brand-400">20년 이상의 경험</span>으로
              </span>
              <span className="block opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100 [animation-delay:240ms]">
                더 스마트한 도시를 만듭니다
              </span>
            </h1>
            <p className="mt-8 max-w-[520px] text-base leading-[1.8] text-white/65 opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100 [animation-delay:380ms] md:text-[18px]">
              스마트시티, AI, 데이터 기술을 기반으로
              <br className="hidden sm:block" /> 도시의 다양한 문제를 연결하고 더 나은 운영 방식을 만들어갑니다.
            </p>
            <div className="mt-10 flex flex-col gap-3 opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100 [animation-delay:500ms] sm:flex-row">
              <Button href="#business">사업분야 보기</Button>
              <Button href={inquiryHref} variant="outline-light">
                사업 문의하기
              </Button>
            </div>
          </div>

          {/* Abstract City System */}
          <div
            ref={graphicRef}
            className="relative mx-auto w-full max-w-[520px] opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100 [animation-delay:300ms] lg:col-span-4 lg:-mr-10 lg:max-w-[min(460px,52svh)] lg:justify-self-end"
          >
            <HeroGraphic active={KEYWORDS[activeIndex].layers} />
          </div>
        </div>

        {/* Keyword Switcher + System Flow */}
        <div className="mt-12 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-12 md:items-center lg:mt-0">
          <div className="md:col-span-6" role="group" aria-label="핵심 Keyword">
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 font-en">
              {KEYWORDS.map((keyword, i) => (
                <li key={keyword.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    aria-pressed={activeIndex === i}
                    onClick={() => selectKeyword(i)}
                    className={`relative min-h-[44px] px-1 text-[15px] font-semibold tracking-[0.08em] transition-colors duration-500 ${
                      activeIndex === i ? "text-cyan" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {keyword.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-1 bottom-2 h-px origin-left bg-cyan transition-transform duration-700 ease-editorial ${
                        activeIndex === i ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-6 md:col-span-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-en text-[12px] uppercase tracking-[0.1em] text-white/50" aria-label="ESE City System Flow">
              {FLOW.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="text-white/35">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white/75">{step}</span>
                  {i < FLOW.length - 1 && <span aria-hidden="true" className="text-cyan">→</span>}
                </li>
              ))}
            </ol>
            <a
              href="#experience"
              aria-label="다음 Section으로 이동"
              className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-white transition-colors hover:border-cyan hover:text-cyan lg:inline-flex"
            >
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

