import type { Solution } from "./types";

/**
 * rino Solution Portfolio — 모든 제품은 동일한 계층으로 관리합니다. (Category 없음)
 *
 * TODO: 공식 제품 설명 확인 후 label/summary를 교체하고 verified를 true로 변경하세요.
 * - verified: false + 아래 문구는 제품명에서 유추한 초안입니다.
 * - 유추가 어려운 제품은 Placeholder 문구로 두었습니다.
 */
const PENDING_LABEL = "Product Type TBD";
const PENDING_SUMMARY = "제품 소개 문구를 준비하고 있습니다.";

export const solutions: Solution[] = [
  { slug: "rino-sos", name: "SOS", label: PENDING_LABEL, summary: PENDING_SUMMARY, verified: false },
  {
    slug: "rino-datahub",
    name: "DataHUB",
    label: "Data Integration",
    summary: "흩어진 도시 데이터를 수집·연계하는 데이터 허브",
    verified: false,
  },
  {
    slug: "rino-iot",
    name: "IOT",
    label: "IoT Platform",
    summary: "현장 센서와 디바이스를 연결하는 IoT 플랫폼",
    verified: false,
  },
  { slug: "rino-uxp", name: "UXP", label: PENDING_LABEL, summary: PENDING_SUMMARY, verified: false },
  { slug: "rino-wcs", name: "WCS", label: PENDING_LABEL, summary: PENDING_SUMMARY, verified: false },
  {
    slug: "rino-vms",
    name: "VMS",
    label: "Video Management",
    summary: "영상 정보를 통합 관리하는 영상 관제 솔루션",
    verified: false,
  },
  { slug: "rino-nfm", name: "NFM", label: PENDING_LABEL, summary: PENDING_SUMMARY, verified: false },
  {
    slug: "rino-gis",
    name: "GIS",
    label: "Geospatial Platform",
    summary: "공간정보를 시각화하고 분석하는 GIS 플랫폼",
    verified: false,
  },
  {
    slug: "rino-fms",
    name: "FMS",
    label: "Facility Management",
    summary: "도시 시설물의 이력과 상태를 관리하는 시설관리 솔루션",
    verified: false,
  },
];

export const solutionFullName = (solution: Solution) => `rino ${solution.name}`;
