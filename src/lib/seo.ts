import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

/** 페이지별 Title / Description / Open Graph / Canonical을 한 번에 만듭니다. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: siteConfig.legalName,
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
    },
  };
}
