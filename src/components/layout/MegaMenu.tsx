import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NavGroup } from "@/content/types";

type MegaMenuProps = {
  group: NavGroup;
  id: string;
  onNavigate: () => void;
};

export function MegaMenu({ group, id, onNavigate }: MegaMenuProps) {
  const isSolution = group.key === "solution";

  return (
    <div id={id} className="absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_24px_48px_-32px_rgba(11,18,32,0.25)]">
      <div className="container grid max-w-content grid-cols-12 gap-10 py-12">
        <div className="col-span-4 flex flex-col border-r border-line pr-10">
          <p className="eyebrow">{group.eyebrow}</p>
          <p className="mt-4 font-en text-[40px] font-semibold leading-none tracking-[-0.04em]">{group.label}</p>
          <p className="mt-5 max-w-[300px] text-[15px] leading-relaxed text-muted">{group.description}</p>
          <Link
            href={group.href}
            onClick={onNavigate}
            className="group mt-auto inline-flex min-h-[44px] items-center gap-2 pt-8 text-sm font-semibold text-ink hover:text-brand"
          >
            {group.label} 바로가기
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className={`col-span-8 grid gap-px bg-line ${isSolution ? "grid-cols-3" : "grid-cols-2"}`}>
          {group.links.map((link, i) => (
            <li key={link.href} className="bg-white">
              <Link
                href={link.href}
                onClick={onNavigate}
                className="group flex h-full min-h-[84px] items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-subtle"
              >
                <span className="flex flex-col gap-1.5">
                  {isSolution ? (
                    <span className="font-en text-[22px] font-semibold tracking-[-0.03em]">
                      <span className="font-normal text-muted">rino </span>
                      {link.label.replace(/^rino /, "")}
                    </span>
                  ) : (
                    <span className="text-[17px] font-semibold tracking-[-0.02em]">{link.label}</span>
                  )}
                  <span className="font-en text-[12px] uppercase tracking-[0.08em] text-muted">
                    {isSolution ? link.en : `${String(i + 1).padStart(2, "0")} · ${link.en}`}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-brand"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
