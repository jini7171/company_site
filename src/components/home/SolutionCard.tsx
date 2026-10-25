import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Solution } from "@/content/types";

export function SolutionCard({ solution, index, total }: { solution: Solution; index: number; total: number }) {
  return (
    <Link
      href={`/solution/${solution.slug}`}
      className="group relative flex h-full min-h-[260px] flex-col overflow-hidden bg-white p-7 transition-colors duration-500 hover:bg-brand-50/60 md:p-8 lg:min-h-0 lg:p-6"
    >
      {/* Hover 시 나타나는 기술 Pattern */}
      <span
        aria-hidden="true"
        className="bg-dot-matrix pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-0 transition-opacity duration-700 [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)] group-hover:opacity-100"
      />
      {/* Hover 시 강조되는 Border */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-brand"
      />

      <div className="flex items-center justify-between font-en text-[12px] tracking-[0.08em]">
        <span className="font-semibold text-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="uppercase text-brand">{solution.label}</span>
      </div>

      <h3 className="mt-auto pt-12 font-en lg:pt-6 leading-none tracking-[-0.045em]">
        <span className="block text-[17px] font-medium tracking-[-0.01em] text-muted">rino</span>
        <span className="mt-1 block text-[clamp(2.25rem,3vw,2.75rem)] font-semibold text-ink">{solution.name}</span>
      </h3>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5 lg:mt-4 lg:pt-4">
        <p className="text-[15px] leading-[1.6] text-muted">{solution.summary}</p>
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-ink/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-brand"
        />
      </div>
    </Link>
  );
}
