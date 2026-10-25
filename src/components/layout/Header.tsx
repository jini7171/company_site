"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { inquiryHref, mainNavigation } from "@/content/navigation";
import type { NavGroup } from "@/content/types";
import { Logo } from "@/components/ui/Logo";
import { isInGroup } from "@/lib/nav";
import { MegaMenu } from "./MegaMenu";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<NavGroup["key"] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeAll = useCallback(() => {
    setActiveKey(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    if (!activeKey && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = activeKey ? document.getElementById(`nav-trigger-${activeKey}`) : null;
      closeAll();
      trigger?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setActiveKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [activeKey, mobileOpen, closeAll]);

  const openMenu = (key: NavGroup["key"]) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveKey(key);
  };

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setActiveKey(null), 160);
  };

  const activeGroup = mainNavigation.find((group) => group.key === activeKey);
  const solid = scrolled || activeKey !== null || mobileOpen;

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveKey(null);
      }}
      className={`sticky top-0 z-50 h-[var(--header-h)] border-b transition-[background-color,border-color] duration-300 ${
        // backdrop-filter는 fixed 자식(Mobile 메뉴)의 기준을 바꾸므로 Mobile 메뉴가 열리면 해제합니다.
        mobileOpen ? "border-line bg-white" : solid ? "border-line bg-white/90 backdrop-blur-md" : "border-transparent bg-white"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        본문 바로가기
      </a>

      <div className="container flex h-full max-w-content items-center justify-between gap-8">
        <Logo />

        <nav aria-label="주요 메뉴" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-1">
            {mainNavigation.map((group) => {
              const open = activeKey === group.key;
              const current = isInGroup(pathname, group.key);
              return (
                <li key={group.key} className="h-full" onMouseEnter={() => openMenu(group.key)}>
                  {/* 대메뉴 클릭 시 첫 번째 하위 메뉴로 이동 · Hover/Focus 시 Mega Menu 표시 */}
                  <Link
                    id={`nav-trigger-${group.key}`}
                    href={group.links[0].href}
                    aria-expanded={open}
                    aria-controls={`mega-${group.key}`}
                    onFocus={() => openMenu(group.key)}
                    onClick={closeAll}
                    className={`relative flex h-full items-center gap-1.5 px-5 text-[15px] font-semibold tracking-[-0.01em] transition-colors ${
                      open || current ? "text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    {group.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 opacity-50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-5 bottom-0 h-[2px] origin-left bg-brand transition-transform duration-300 ease-editorial ${
                        open ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={inquiryHref}
            className="hidden min-h-[44px] items-center bg-ink px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand md:inline-flex"
          >
            사업 문의
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          >
            {mobileOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {activeGroup && (
        <div onMouseEnter={() => openMenu(activeGroup.key)} className="hidden lg:block">
          <MegaMenu group={activeGroup} id={`mega-${activeGroup.key}`} onNavigate={closeAll} />
        </div>
      )}

      {mobileOpen && <MobileNavigation id="mobile-navigation" onNavigate={closeAll} />}
    </header>
  );
}
