import type { HistoryEra } from "@/content/types";
import { Placeholder } from "./Placeholder";

/** 연혁 Timeline — 시대(Era) 단위로 묶고, Milestone은 Data에서 읽어옵니다. */
export function Timeline({ eras }: { eras: HistoryEra[] }) {
  return (
    <ol className="border-t border-ink">
      {eras.map((era, i) => (
        <li key={era.period} className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-14" data-reveal>
          <div className="md:col-span-5">
            <p className="font-en text-[13px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-4 font-en text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold leading-none tracking-[-0.045em]">{era.period}</p>
            <p className="mt-4 font-en text-eyebrow font-semibold uppercase text-muted">{era.en}</p>
            <h3 className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{era.title}</h3>
          </div>
          <div className="md:col-span-7 md:pt-8">
            {era.milestones.length > 0 ? (
              <ul className="space-y-4">
                {era.milestones.map((m) => (
                  <li key={`${m.year}-${m.month}-${m.text}`} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line pb-4 text-[16px]">
                    <span className="font-en font-semibold tabular-nums text-ink">
                      {m.year}
                      {m.month ? `.${String(m.month).padStart(2, "0")}` : ""}
                    </span>
                    <span className="text-ink/80">{m.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder>연혁 정보를 정리하고 있습니다.</Placeholder>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
