"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ENTRY_KEY = "ese_entry_sent";

// 같은 경로가 연달아 두 번 기록되지 않게 합니다. (개발 모드 Strict Mode의 Effect 중복 실행 포함)
let lastTracked: string | null = null;

/** 페이지 이동마다 방문 기록을 남깁니다. 탭(세션)의 첫 페이지에만 유입 경로(referrer)를 보냅니다. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname === lastTracked) return;
    lastTracked = pathname;

    let entry = false;
    try {
      entry = !sessionStorage.getItem(ENTRY_KEY);
      sessionStorage.setItem(ENTRY_KEY, "1");
    } catch {
      // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 첫 페이지 구분 없이 기록합니다.
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: entry ? document.referrer : "", entry }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
