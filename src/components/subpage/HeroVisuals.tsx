import { BusinessGraphic } from "@/components/graphics/BusinessGraphic";
import { HeroGraphic, type HeroLayer } from "@/components/home/HeroGraphic";
import type { BusinessGraphicKind } from "@/content/types";

/** SubpageHero 우측에 들어가는 추상 Graphic 모음 — 부모 높이에 맞춰 크기가 정해집니다. */

export function CitySystemVisual({ active }: { active: HeroLayer[] }) {
  return <HeroGraphic active={active} />;
}

export function BusinessVisual({ kind }: { kind: BusinessGraphicKind }) {
  return (
    <div className="relative aspect-[4/3] h-full overflow-hidden border border-white/15 text-white/60">
      <BusinessGraphic kind={kind} className="absolute inset-0 !h-full !w-full" />
    </div>
  );
}

/** Solution 제품명 Typography Mark */
export function ProductVisual({ name, label }: { name: string; label: string }) {
  return (
    <div className="relative aspect-[4/3] h-full overflow-hidden border border-white/15">
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute inset-0 flex flex-col justify-between p-7">
        <span className="font-en text-[12px] uppercase tracking-[0.14em] text-cyan">{label}</span>
        <span className="font-en leading-none tracking-[-0.05em]">
          <span className="block text-[20px] font-medium text-white/50">rino</span>
          <span className="block text-[clamp(3rem,5vw,4.5rem)] font-semibold text-white">{name}</span>
        </span>
      </div>
    </div>
  );
}
