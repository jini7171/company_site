"use client";

import { useEffect, useRef, useState } from "react";
import type { CompanyMetric } from "@/content/types";
import { revealDelay } from "@/lib/motion";

const format = (n: number) => n.toLocaleString("en-US");

/** 화면 진입 시 숫자가 천천히 올라가는 Metric. Reduced Motion에서는 최종값을 바로 표시합니다. */
export function Metric({ metric, index }: { metric: CompanyMetric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(metric.value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplay(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1800;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(Math.round(metric.value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [metric.value]);

  return (
    <div ref={ref} className="flex flex-col border-t border-ink pt-6" data-reveal style={revealDelay(index * 120)}>
      <div className="flex items-center justify-between font-en text-eyebrow font-semibold text-muted">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{metric.unit}</span>
      </div>
      <p className="mt-10 font-en text-metric lg:mt-6 font-semibold tabular-nums text-ink">
        <span className="sr-only">
          {format(metric.value)}
          {metric.suffix} {metric.unit}
        </span>
        <span aria-hidden="true">
          {format(display)}
          <span className="text-brand">{metric.suffix}</span>
        </span>
      </p>
      <p className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-ink">{metric.label}</p>
    </div>
  );
}
