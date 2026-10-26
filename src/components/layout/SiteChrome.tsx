"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PageViewTracker } from "./PageViewTracker";

/** 관리자 화면(/admin)에서는 사이트 Header·Footer를 숨깁니다. */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
      <PageViewTracker />
    </>
  );
}
