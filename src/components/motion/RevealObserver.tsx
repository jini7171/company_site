"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * [data-reveal] 요소를 화면 진입 시 표시합니다.
 * 컴포넌트마다 IntersectionObserver를 만들지 않도록 하나의 Observer만 사용합니다.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.setAttribute("data-reveal-ready", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]:not([data-visible])").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
