import type { ReactNode } from "react";

type SectionHeaderProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  aside?: ReactNode;
  /** split: 좌측 Eyebrow / 우측 Headline (기본) · stacked: 좁은 Column 안에서 세로로 쌓음 */
  layout?: "split" | "stacked";
};

/**
 * Editorial Section Header
 * 좌측: Index + Eyebrow / 우측: Headline + Description 의 비대칭 구조
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  id,
  tone = "light",
  aside,
  layout = "split",
}: SectionHeaderProps) {
  const dark = tone === "dark";
  const split = layout === "split";

  return (
    <header className={`grid gap-8 ${split ? "lg:grid-cols-12 lg:gap-10" : ""}`} data-reveal>
      <div className={`flex items-center gap-4 ${split ? "lg:col-span-3 lg:items-start lg:pt-3" : ""}`}>
        {index && (
          <span className={`font-en text-eyebrow font-semibold ${dark ? "text-white/40" : "text-muted"}`}>
            {index}
          </span>
        )}
        <span aria-hidden="true" className={`h-px w-10 ${dark ? "bg-white/25" : "bg-ink/20"} ${split ? "lg:mt-[7px]" : ""}`} />
        <p className={`eyebrow ${dark ? "text-cyan" : ""}`}>{eyebrow}</p>
      </div>

      <div className={split ? "lg:col-span-9" : ""}>
        <h2 id={id} className={`font-kr text-section-kr font-bold ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        <div className={`mt-6 flex flex-col gap-8 ${split ? "md:flex-row md:items-end md:justify-between" : ""}`}>
          {description && (
            <p
              className={`max-w-[560px] text-base leading-[1.75] md:text-[17px] ${dark ? "text-white/65" : "text-muted"}`}
            >
              {description}
            </p>
          )}
          {aside}
        </div>
      </div>
    </header>
  );
}
