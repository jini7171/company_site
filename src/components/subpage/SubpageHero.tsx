import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getNavContext } from "@/lib/nav";

type SubpageHeroProps = {
  /** 현재 페이지 경로 — Breadcrumb 계산에 사용 */
  href: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  graphic?: ReactNode;
};

/**
 * 공통 Subpage Hero
 * 홈 Hero와 같은 남색 배경 + Breadcrumb + 큰 제목 + 추상 Graphic
 */
export function SubpageHero({ href, eyebrow, title, description, graphic }: SubpageHeroProps) {
  const nav = getNavContext(href);

  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />
      <div aria-hidden="true" className="absolute -right-40 -top-20 -z-10 h-[520px] w-[520px] rounded-full bg-brand/15 blur-[140px]" />

      {/* 모든 Subpage Hero는 같은 높이(md 이상 400px)로 고정합니다. */}
      <div className="container relative flex max-w-content flex-col pb-14 pt-8 md:h-[400px] md:pb-16">
        <nav aria-label="현재 위치">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/50">
            <li>
              <Link href="/" className="inline-flex min-h-[32px] items-center hover:text-white">
                Home
              </Link>
            </li>
            {nav && (
              <>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li>
                  <Link href={nav.group.href} className="inline-flex min-h-[32px] items-center hover:text-white">
                    {nav.group.label}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-white/85">
                  {nav.link.label}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="mt-10 md:mt-auto md:pt-14 lg:max-w-[62%]">
          <p className="eyebrow flex items-center gap-3 text-cyan">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-cyan" />
            {eyebrow}
          </p>
          <h1 className="mt-6 font-kr text-[clamp(2.25rem,4.4vw,4rem)] font-bold leading-[1.18] tracking-[-0.04em]">{title}</h1>
          {description && (
            <p className="mt-6 max-w-[560px] text-base leading-[1.8] text-white/65 md:text-[17px]">{description}</p>
          )}
        </div>

        {/* Graphic은 높이에 영향을 주지 않도록 우측에 절대 배치 (Desktop 전용) */}
        {graphic && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-12 right-10 top-10 hidden items-center justify-end lg:flex [&_svg]:h-full [&_svg]:w-auto"
          >
            {graphic}
          </div>
        )}
      </div>
    </section>
  );
}
