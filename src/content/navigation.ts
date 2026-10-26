import { businessAreas } from "./business";
import { solutionFullName, solutions } from "./solutions";
import { technologies } from "./technology";
import type { NavGroup } from "./types";

export const mainNavigation: NavGroup[] = [
  {
    key: "company",
    label: "Company",
    href: "/company/about",
    eyebrow: "ABOUT ESE",
    description: "2000년부터 도시의 문제를 기술로 해결해온 ESE를 소개합니다.",
    links: [
      { label: "회사소개", en: "About", href: "/company/about" },
      { label: "비전 · 핵심가치", en: "Vision", href: "/company/vision" },
      { label: "연혁", en: "History", href: "/company/history" },
      { label: "인증 · 특허", en: "Certification", href: "/company/certifications" },
      { label: "오시는 길", en: "Location", href: "/company/location" },
    ],
  },
  {
    key: "business",
    label: "Business",
    href: "/business/smart-city",
    eyebrow: "WHERE WE APPLY",
    description: "ESE의 역량이 적용되는 도시의 다섯 가지 사업 영역입니다.",
    links: [
      ...businessAreas.map((area) => ({
        label: area.title,
        en: area.en,
        href: `/business/${area.slug}`,
      })),
      { label: "사업실적", en: "Performance", href: "/business/performance" },
    ],
  },
  {
    key: "technology",
    label: "Technology",
    href: "/technology/ai",
    eyebrow: "HOW WE BUILD",
    description: "AI, Big Data, Smart Platform을 연결해 사업을 구축하고 운영합니다.",
    links: technologies.map((tech) => ({
      label: tech.title,
      en: tech.en,
      href: `/technology/${tech.slug}`,
    })),
  },
  {
    key: "solution",
    label: "Solution",
    href: "/solution/rino-sos",
    eyebrow: "RINO SOLUTION",
    description: "도시 운영을 위한 ESE의 자체 Solution Portfolio입니다.",
    links: solutions.map((solution) => ({
      label: solutionFullName(solution),
      en: solution.label,
      href: `/solution/${solution.slug}`,
    })),
  },
  {
    key: "news",
    label: "Support",
    href: "/news",
    eyebrow: "NEWS & CONTACT",
    description: "ESE의 새로운 소식과 보도자료, 사업 협력 문의 창구입니다.",
    links: [
      { label: "ESE 소식", en: "News", href: "/news" },
      { label: "보도자료", en: "Press", href: "/press" },
      { label: "사업문의", en: "Contact", href: "/contact" },
    ],
  },
];

export const inquiryHref = "/contact";

/** Footer 하단 약관 링크 — TODO: 페이지 및 공식 약관 본문 추가 */
export const legalLinks = [
  { label: "개인정보취급방침", href: "/privacy", emphasis: true },
  { label: "이용약관", href: "/terms", emphasis: false },
];
