"use client";

import { useState } from "react";
import { technologies } from "@/content/technology";
import { TechnologyItem } from "./TechnologyItem";

/** 두 기술 사이 연결 구간 Label (Desktop) */
const LINKS = ["DATA ⇄ INSIGHT", "DATA ⇄ SERVICE"];

/** Card Column 사이 간격(lg:gap-6)과 Column 너비 — Rail 구간 위치 계산용 */
const GAP = 24;
const COL = `((100% - ${GAP * 2}px) / 3)`;

/**
 * AI ↔ Big Data ↔ Smart Platform
 * 세 기술을 하나의 Rail 위 Node로 배치해 서로 연결된 Ecosystem임을 표현합니다.
 * Desktop: 가로 Rail / Mobile: 세로 Flow
 */
export function TechnologyDiagram() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* Desktop 가로 Rail */}
      <div aria-hidden="true" className="absolute inset-x-0 top-7 hidden lg:block">
        <div className="relative h-px bg-white/15">
          {LINKS.map((label, i) => {
            const lit = active === null || active === i || active === i + 1;
            return (
              <div
                key={label}
                className={`absolute top-0 h-px transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-25"}`}
                style={{ left: `calc(${i} * (${COL} + ${GAP}px) + 56px)`, width: `calc(${COL} + ${GAP}px - 56px)` }}
              >
                <span className="flow-rail absolute inset-x-0 -top-[3px] h-px text-cyan motion-reduce:hidden" />
                <span className="flow-rail flow-rail-reverse absolute inset-x-0 top-[3px] h-px text-brand-400 motion-reduce:hidden" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-en text-[11px] tracking-[0.14em] text-white/45">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 lg:gap-6">
        {technologies.map((tech, i) => (
          <TechnologyItem
            key={tech.slug}
            tech={tech}
            index={i}
            active={active === i}
            dimmed={active !== null && active !== i}
            onActivate={() => setActive(i)}
            onDeactivate={() => setActive(null)}
          />
        ))}
      </div>
    </div>
  );
}
