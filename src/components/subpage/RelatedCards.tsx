import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type RelatedItem = {
  href: string;
  eyebrow: string;
  title: string;
  text?: string;
};

/** 관련 사업·기술·솔루션 링크 Card */
export function RelatedCards({ items }: { items: RelatedItem[] }) {
  return (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href} className="bg-white">
          <Link
            href={item.href}
            className="group relative flex h-full min-h-[180px] flex-col p-7 transition-colors duration-500 hover:bg-brand-50/60"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-brand" />
            <span className="flex items-start justify-between gap-4">
              <span className="font-en text-[12px] uppercase tracking-[0.1em] text-brand">{item.eyebrow}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-ink/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </span>
            <span className="mt-auto pt-10 text-[22px] font-bold tracking-[-0.03em]">{item.title}</span>
            {item.text && <span className="mt-2 text-[14px] leading-[1.6] text-muted">{item.text}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
