import type { BusinessArea } from "./types";

/**
 * 배경 사진 — Unsplash 무료 License 이미지 (images.unsplash.com Hotlink)
 * TODO: 실제 ESE 프로젝트 사진 확보 시 public/images/business/ 로 교체하세요.
 */
// 원본(수 MB)을 그대로 받으면 Image Optimizer가 시간 초과되므로 1600px로 줄여서 받습니다.
const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&fm=jpg&fit=crop`;

export const businessAreas: BusinessArea[] = [
  {
    slug: "smart-city",
    index: "01",
    title: "스마트시티",
    en: "Smart City",
    summary: "도시 인프라와 데이터를 연결해 도시 전체를 하나의 운영 체계로 통합합니다.",
    keywords: ["Integrated Operation", "Urban Data", "City Platform"],
    graphic: "urban",
    image: { src: unsplash("photo-1752731904238-37ca976fd275") },
    featured: true,
  },
  {
    slug: "disaster-safety",
    index: "02",
    title: "재난안전",
    en: "Disaster & Safety",
    summary: "위험 징후를 감지하고 상황을 공유해 신속한 대응 체계를 지원합니다.",
    keywords: ["Monitoring", "Alert", "Response"],
    graphic: "safety",
    image: { src: unsplash("photo-1740240240779-1a8c62ef2a58") },
  },
  {
    slug: "global-smart-city",
    index: "03",
    title: "해외 스마트시티",
    en: "Global Smart City",
    summary: "국내에서 검증한 스마트시티 경험을 해외 도시 환경에 맞게 적용합니다.",
    keywords: ["Partnership", "Localization", "Export"],
    graphic: "global",
    image: { src: unsplash("photo-1595290429614-88ba93221dba") },
  },
  {
    slug: "geospatial",
    index: "04",
    title: "국토공간정보",
    en: "Geospatial Information",
    summary: "공간 데이터를 구축·분석해 정확한 국토 정보 기반을 만듭니다.",
    keywords: ["GIS", "Spatial Data", "Mapping"],
    graphic: "geospatial",
    image: { src: unsplash("photo-1708526232513-111d31cf6181") },
  },
  {
    slug: "road-transportation",
    index: "05",
    title: "도로교통",
    en: "Road & Transportation",
    summary: "도로와 교통 흐름 데이터를 활용해 안전하고 효율적인 이동을 지원합니다.",
    keywords: ["Traffic", "Road Facility", "Mobility"],
    graphic: "road",
    image: { src: unsplash("photo-1496055401924-5e7fdc885742") },
  },
];

// 사업 분야별 실적(건수·최근 프로젝트)은 content/projects.ts의 getBusinessPerformance()에서 Supabase 데이터로 계산합니다.

export const getBusinessArea = (slug: string) => businessAreas.find((area) => area.slug === slug);
