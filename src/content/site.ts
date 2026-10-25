import type { CompanyMetric, ContactChannel } from "./types";

export const siteConfig = {
  name: "ESE",
  legalName: "ESE Co., Ltd.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "ESE | Smart City · AI · Data",
  description:
    "스마트시티, AI, 데이터 기술과 오랜 프로젝트 경험을 기반으로 도시의 새로운 운영 방식을 만드는 ESE",
  foundedAt: "2000-04-24",
  foundedYear: 2000,
  employees: "약 100명",
  statement: "EXPERIENCE BUILDS SMARTER CITIES",
} as const;

export const companyMetrics: CompanyMetric[] = [
  { value: 25, suffix: "+", unit: "YEARS", label: "축적된 사업 경험" },
  { value: 2000, suffix: "+", unit: "PROJECTS", label: "수행 프로젝트" },
  { value: 1400, suffix: "+", unit: "REFERENCES", label: "공공·민간 레퍼런스" },
];

/**
 * 연락처 — 공식 정보 확정 전까지 value/href는 null로 둡니다.
 * TODO: 대표 전화, 대표 Email, KakaoTalk 채널 주소, 회사 주소 입력
 */
export const contactChannels: ContactChannel[] = [
  { key: "phone", label: "전화 문의", en: "Phone", value: null, href: null },
  { key: "email", label: "Email 문의", en: "Email", value: null, href: null },
  { key: "form", label: "온라인 사업문의", en: "Inquiry Form", value: "문의 양식 작성하기", href: "/contact" },
  { key: "kakao", label: "KakaoTalk 상담", en: "KakaoTalk", value: null, href: null },
];

export const companyInfo = {
  /** TODO: 공식 주소 입력 */
  address: null as string | null,
  /** TODO: 사업자등록번호 입력 */
  businessNumber: null as string | null,
  ceo: null as string | null,
};

export const PLACEHOLDER_TEXT = "정보 등록 예정";
