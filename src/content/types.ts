/**
 * Content 타입 정의
 * 향후 CMS/API 연동 시 이 타입을 응답 스키마 기준으로 사용합니다.
 */

export type NavLink = {
  label: string;
  href: string;
  /** 영문 보조 Label */
  en?: string;
  description?: string;
};

export type NavGroup = {
  key: "company" | "business" | "technology" | "solution" | "news";
  label: string;
  href: string;
  eyebrow: string;
  description: string;
  links: NavLink[];
};

export type CompanyMetric = {
  value: number;
  suffix: string;
  unit: string;
  label: string;
};

export type BusinessGraphicKind = "urban" | "safety" | "global" | "geospatial" | "road";

export type BusinessArea = {
  slug: string;
  index: string;
  title: string;
  en: string;
  summary: string;
  keywords: string[];
  graphic: BusinessGraphicKind;
  /** Graphic 뒤에 옅게 깔리는 배경 사진 (실제 프로젝트 사진 확보 시 교체) */
  image?: { src: string; position?: string };
  featured?: boolean;
};

export type BusinessPerformance = {
  businessSlug: string;
  /** 공개된 프로젝트 수. null이면 "집계 중"으로 표시 */
  projectCount: number | null;
  /** 가장 최근에 작성된 프로젝트명 */
  latestTitle?: string;
};

/** 사업실적 프로젝트 — Supabase `company_projects` */
export type Project = {
  id: number;
  /** 프로젝트 분류 (content/projects.ts의 projectCategories) */
  category: string;
  title: string;
  content?: string;
  imageUrl: string;
  /** 구축기간 YYYY-MM-DD */
  startDate?: string;
  endDate?: string;
  /** 작성일 YYYY-MM-DD */
  writtenDate?: string;
};

/** 보도자료 — Supabase `company_press` (작성자는 관리용이라 사이트에 내보내지 않음) */
export type PressRelease = {
  id: number;
  title: string;
  /** 출처 — 기사 원문 링크 */
  sourceUrl: string;
  imageUrl: string;
  content: string;
  /** 작성일 YYYY-MM-DD */
  writtenDate: string;
};

/** 인증/특허 — Supabase `company_certifications` (작성자는 관리용이라 사이트에 내보내지 않음) */
export type Certification = {
  id: number;
  /** 분류 이름 (company_certification_categories) */
  category: string;
  title: string;
  content?: string;
  imageUrl: string;
  /** 작성일 YYYY-MM-DD */
  writtenDate: string;
};

export type Technology = {
  slug: string;
  title: string;
  en: string;
  copy: string;
  keywords: string[];
  capabilities?: string[];
};

export type Solution = {
  slug: string;
  name: string;
  /** 짧은 기술 Label */
  label: string;
  /** 한 줄 설명 */
  summary: string;
  /** false이면 공식 확인 전 초안 문구 */
  verified: boolean;
};

export type HistoryEra = {
  period: string;
  title: string;
  en: string;
  milestones: { year: number; month?: number; text: string }[];
};

export type ContactChannel = {
  key: "phone" | "email" | "form" | "kakao";
  label: string;
  en: string;
  /** null이면 미확정 → Placeholder 표시 */
  value: string | null;
  href: string | null;
};

/* ───────── Subpage Detail ───────── */

export type TitledText = { title: string; text: string };

export type BusinessDetail = {
  overview: string;
  challenges: TitledText[];
  capabilities: TitledText[];
  services: string[];
  relatedTechnologies: string[];
  /** TODO: 공식 제품-사업 매핑 확인 필요 */
  relatedSolutions: string[];
};

export type TechnologyDetail = {
  overview: string;
  capabilities: TitledText[];
  process: { step: string; en: string; text: string }[];
  applications: { businessSlug: string; text: string }[];
  relatedSolutions: string[];
};

export type SolutionDetail = {
  /** null이면 공식 소개 문구 미확정 → Placeholder 표시 */
  overview: string | null;
  features: TitledText[];
  architecture: { layer: string; en: string; items: string[] }[] | null;
  useCases: string[];
  relatedBusiness: string[];
};

export type CoreValue = { en: string; title: string; text: string };

export type BoardCategory = "news";

/** 게시판 게시물 — CMS/API 연동 시 이 형태로 응답을 맞추세요. */
export type BoardPost = {
  id: string;
  category: BoardCategory;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** 문단 단위 본문 */
  body: string[];
  /** 목록 상단 고정(공지) */
  pinned?: boolean;
  /** 보도자료 원문 기사 링크 */
  sourceUrl?: string;
  attachments?: { name: string; href: string }[];
};
