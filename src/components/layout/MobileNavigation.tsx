"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { inquiryHref, mainNavigation } from "@/content/navigation";

type MobileNavigationProps = {
  id: string;
  onNavigate: () => void;
};

export function MobileNavigation({ id, onNavigate }: MobileNavigationProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      id={id}
      className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto bg-white lg:hidden"
    >
      <nav aria-label="모바일 메뉴" className="container flex-1 py-4">
        <ul>
          {mainNavigation.map((group) => {
            const open = expanded === group.key;
            const panelId = `${id}-${group.key}`;
            return (
              <li key={group.key} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setExpanded(open ? null : group.key)}
                  className="flex min-h-[64px] w-full items-center justify-between text-left"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-en text-[24px] font-semibold tracking-[-0.03em]">{group.label}</span>
                    <span className="font-en text-[11px] tracking-[0.12em] text-muted">{group.eyebrow}</span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                <ul id={panelId} hidden={!open} className="pb-5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="flex min-h-[44px] items-center justify-between text-[16px] text-ink/80 hover:text-brand"
                      >
                        {link.label}
                        <span className="font-en text-[11px] uppercase tracking-[0.08em] text-muted">{link.en}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="container border-t border-line py-5">
        <Link
          href={inquiryHref}
          onClick={onNavigate}
          className="flex min-h-[52px] items-center justify-center bg-brand text-[15px] font-semibold text-white"
        >
          사업 문의하기
        </Link>
      </div>
    </div>
  );
}
