import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BusinessGraphic } from "@/components/graphics/BusinessGraphic";
import type { BusinessArea } from "@/content/types";

/** 강조 사업 분야 (Smart City) — 큰 Graphic 영역을 가진 Feature 형태 */
export function BusinessFeatureCard({ area }: { area: BusinessArea }) {
  return (
    <Link
      href={`/business/${area.slug}`}
      className="group relative flex h-full min-h-[520px] flex-col overflow-hidden border border-line bg-white transition-colors duration-500 hover:border-brand/50 lg:min-h-[500px]"
    >
      <div className="flex items-start justify-between p-7 md:p-10 lg:p-8">
        <div>
          <p className="font-en text-[13px] font-semibold text-brand">{area.index}</p>
          <p className="mt-6 font-en text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.045em]">
            {area.en}
          </p>
          <h3 className="mt-4 text-[22px] font-bold tracking-[-0.03em]">{area.title}</h3>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15 transition-colors duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden border-y border-line bg-subtle text-ink">
        <BusinessPhoto
          area={area}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="opacity-[0.18] group-hover:scale-[1.04] group-hover:opacity-30 group-hover:grayscale-[40%]"
        />
        <BusinessGraphic
          kind={area.graphic}
          className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-editorial group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-5 p-7 md:flex-row md:items-end md:justify-between md:p-10 lg:p-8">
        <p className="max-w-[380px] text-[16px] leading-[1.7] text-muted">{area.summary}</p>
        <ul className="flex flex-wrap gap-2">
          {area.keywords.map((k) => (
            <li key={k} className="border border-line px-3 py-1.5 font-en text-[12px] text-ink/70">
              {k}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

/** 일반 사업 분야 — 세로 리스트 Row. Hover/Focus 시 설명이 펼쳐집니다. */
export function BusinessCard({ area }: { area: BusinessArea }) {
  return (
    <Link
      href={`/business/${area.slug}`}
      className="group relative flex items-stretch gap-6 border-b border-line py-7 transition-colors lg:py-5 duration-500 hover:bg-subtle lg:px-6"
    >
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <span className="font-en text-[13px] font-semibold text-muted transition-colors group-hover:text-brand">{area.index}</span>
          <span className="font-en text-[12px] uppercase tracking-[0.1em] text-muted">{area.en}</span>
        </div>
        <h3 className="mt-3 text-[24px] font-bold tracking-[-0.03em] md:text-[28px]">{area.title}</h3>
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-editorial lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
          <p className="overflow-hidden text-[15px] leading-[1.7] text-muted">
            <span className="block pt-3">{area.summary}</span>
          </p>
        </div>
      </div>

      <div className="relative hidden w-[132px] shrink-0 overflow-hidden border border-line bg-white text-ink sm:block">
        <BusinessPhoto
          area={area}
          sizes="132px"
          className="opacity-[0.22] group-hover:scale-110 group-hover:opacity-40 group-hover:grayscale-[40%]"
        />
        <BusinessGraphic
          kind={area.graphic}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-editorial group-hover:scale-110"
        />
      </div>

      <ArrowRight
        aria-hidden="true"
        className="mt-1 h-5 w-5 shrink-0 self-start text-ink/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-brand"
      />
    </Link>
  );
}

/** Graphic 뒤에 옅게 깔리는 흑백 사진 — 장식용이므로 대체 텍스트를 비워둡니다. */
function BusinessPhoto({ area, sizes, className }: { area: BusinessArea; sizes: string; className: string }) {
  if (!area.image) return null;
  return (
    <Image
      src={area.image.src}
      alt=""
      aria-hidden="true"
      fill
      sizes={sizes}
      className={`object-cover grayscale transition-[opacity,transform,filter] duration-[1.2s] ease-editorial ${className}`}
      style={{ objectPosition: area.image.position }}
    />
  );
}
