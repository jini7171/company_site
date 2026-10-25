import type { SolutionDetail } from "./types";

/**
 * rino Solution 상세 페이지 Content
 *
 * TODO: 공식 제품 소개서를 받아 교체하세요.
 * - DataHUB, IOT, VMS, GIS, FMS: 제품명에서 유추한 초안입니다.
 * - SOS, UXP, WCS, NFM: 제품 성격을 알 수 없어 비워두었습니다. (화면에는 Placeholder 표시)
 */
const PENDING: SolutionDetail = {
  overview: null,
  features: [],
  architecture: null,
  useCases: [],
  relatedBusiness: [],
};

/** 공통 3계층 구조 초안 — 제품별 실제 구성도로 교체 */
const layers = (collect: string[], process: string[], serve: string[]) => [
  { layer: "수집·연계", en: "Collect", items: collect },
  { layer: "처리·관리", en: "Process", items: process },
  { layer: "서비스", en: "Serve", items: serve },
];

export const solutionDetails: Record<string, SolutionDetail> = {
  "rino-sos": PENDING,
  "rino-uxp": PENDING,
  "rino-wcs": PENDING,
  "rino-nfm": PENDING,
  "rino-datahub": {
    overview: "기관과 시스템에 흩어진 도시 데이터를 수집·연계해 하나의 데이터 기반으로 관리하는 데이터 허브입니다.",
    features: [
      { title: "다양한 데이터 수집", text: "시스템, 센서, 외부 기관의 데이터를 수집합니다." },
      { title: "표준화·연계", text: "서로 다른 형식의 데이터를 표준에 맞춰 연결합니다." },
      { title: "데이터 관리", text: "데이터의 품질과 이력을 체계적으로 관리합니다." },
      { title: "데이터 제공", text: "필요한 서비스에 API로 데이터를 제공합니다." },
    ],
    architecture: layers(["기관 시스템", "현장 센서", "외부 데이터"], ["표준화", "저장", "품질 관리"], ["API", "대시보드", "분석 서비스"]),
    useCases: ["도시 데이터 통합 관리", "기관 간 데이터 공유", "분석 서비스 데이터 공급"],
    relatedBusiness: ["smart-city", "global-smart-city", "geospatial"],
  },
  "rino-iot": {
    overview: "현장의 센서와 디바이스를 연결해 상태를 수집하고 제어할 수 있도록 하는 IoT 플랫폼입니다.",
    features: [
      { title: "디바이스 연결", text: "다양한 통신 방식의 센서와 장비를 연결합니다." },
      { title: "상태 수집", text: "현장 장비의 상태와 측정값을 실시간으로 수집합니다." },
      { title: "원격 관리", text: "장비 설정과 상태를 원격에서 관리합니다." },
      { title: "이벤트 처리", text: "기준을 벗어난 값을 감지해 알림으로 전달합니다." },
    ],
    architecture: layers(["센서", "게이트웨이", "현장 장비"], ["디바이스 관리", "데이터 처리", "이벤트 규칙"], ["모니터링", "알림", "연계 API"]),
    useCases: ["시설물 상태 모니터링", "환경 데이터 수집", "재난 감시 센서 연동"],
    relatedBusiness: ["smart-city", "disaster-safety", "road-transportation"],
  },
  "rino-vms": {
    overview: "여러 곳의 영상 정보를 하나의 환경에서 통합 관리하고 관제할 수 있도록 하는 영상 관제 솔루션입니다.",
    features: [
      { title: "영상 통합 관리", text: "여러 장소의 영상을 한 곳에서 관리합니다." },
      { title: "실시간 관제", text: "필요한 영상을 실시간으로 확인합니다." },
      { title: "영상 검색", text: "저장된 영상을 조건에 맞춰 빠르게 찾습니다." },
      { title: "연계 활용", text: "다른 시스템의 이벤트와 영상을 함께 확인합니다." },
    ],
    architecture: layers(["카메라", "영상 장비"], ["영상 저장", "영상 분석 연계"], ["관제 화면", "검색", "이벤트 연동"]),
    useCases: ["도시 안전 관제", "재난 현장 확인", "교통 상황 모니터링"],
    relatedBusiness: ["smart-city", "disaster-safety", "road-transportation"],
  },
  "rino-gis": {
    overview: "공간정보를 지도 위에 시각화하고 분석해 위치 기반 업무와 서비스를 지원하는 GIS 플랫폼입니다.",
    features: [
      { title: "지도 시각화", text: "다양한 공간 데이터를 지도 위에 표현합니다." },
      { title: "공간 분석", text: "위치와 범위를 기준으로 데이터를 분석합니다." },
      { title: "레이어 관리", text: "주제별 공간 데이터를 레이어로 관리합니다." },
      { title: "업무 연계", text: "다른 시스템과 위치 정보를 기준으로 연결합니다." },
    ],
    architecture: layers(["공간 DB", "행정 정보", "현장 데이터"], ["공간 처리", "레이어 관리"], ["지도 서비스", "공간 분석", "연계 API"]),
    useCases: ["지도 기반 상황 관리", "시설물 위치 관리", "공간 분석 업무"],
    relatedBusiness: ["geospatial", "smart-city", "global-smart-city"],
  },
  "rino-fms": {
    overview: "도시 시설물의 위치, 이력, 상태를 체계적으로 관리하는 시설관리 솔루션입니다.",
    features: [
      { title: "시설물 대장 관리", text: "시설물의 기본 정보와 위치를 관리합니다." },
      { title: "점검·보수 이력", text: "점검과 보수 이력을 기록하고 조회합니다." },
      { title: "상태 모니터링", text: "시설물의 상태를 확인하고 이상을 관리합니다." },
      { title: "현황 리포트", text: "관리 현황을 정리해 보고서로 제공합니다." },
    ],
    architecture: layers(["시설물 정보", "점검 데이터", "센서 데이터"], ["이력 관리", "상태 관리"], ["시설 관리 화면", "리포트", "지도 연계"]),
    useCases: ["도로 시설물 관리", "도시 기반시설 관리", "점검 업무 관리"],
    relatedBusiness: ["road-transportation", "geospatial", "smart-city"],
  },
};
