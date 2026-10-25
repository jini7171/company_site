import type { TechnologyDetail } from "./types";

/**
 * 기술 상세 페이지 Content
 * TODO: 아래 문구는 기술 영역의 일반적인 범위를 기준으로 작성한 초안입니다. 기술 담당 검토 후 수정하세요.
 */
export const technologyDetails: Record<string, TechnologyDetail> = {
  ai: {
    overview:
      "ESE의 AI 기술은 도시 현장에서 수집되는 데이터와 영상을 분석하고 예측해, 운영자가 더 빠르고 정확하게 판단할 수 있도록 돕습니다. 실제 사업 환경에 맞춰 모델을 적용하고 운영하는 데 초점을 둡니다.",
    capabilities: [
      { title: "영상 분석", text: "영상 데이터에서 객체와 상황을 인식해 운영자에게 알립니다." },
      { title: "예측 분석", text: "축적된 데이터를 바탕으로 변화와 위험을 미리 예측합니다." },
      { title: "이상 탐지", text: "평소와 다른 패턴을 찾아내 이상 상황을 조기에 발견합니다." },
      { title: "업무 자동화", text: "반복되는 판단과 처리를 자동화해 운영 부담을 줄입니다." },
    ],
    process: [
      { step: "데이터 준비", en: "Prepare", text: "분석 목적에 맞게 데이터를 수집하고 정제합니다." },
      { step: "모델링", en: "Model", text: "문제에 맞는 분석 모델을 설계하고 학습합니다." },
      { step: "검증", en: "Validate", text: "실제 환경과 같은 조건에서 성능을 확인합니다." },
      { step: "적용·운영", en: "Operate", text: "서비스에 적용하고 운영하며 지속적으로 개선합니다." },
    ],
    applications: [
      { businessSlug: "smart-city", text: "도시 상황 인식과 운영 판단 지원" },
      { businessSlug: "disaster-safety", text: "위험 징후 감지와 이상 상황 탐지" },
      { businessSlug: "road-transportation", text: "교통 흐름 예측과 돌발 상황 인식" },
    ],
    relatedSolutions: ["rino-vms", "rino-datahub", "rino-sos"],
  },
  "big-data": {
    overview:
      "ESE의 Big Data 기술은 데이터의 수집부터 연계, 저장, 분석, 시각화까지 데이터 활용 전 과정을 하나로 통합합니다. 흩어진 도시 데이터를 연결해 업무와 서비스에서 바로 쓸 수 있는 형태로 만듭니다.",
    capabilities: [
      { title: "수집·연계", text: "다양한 기관과 시스템의 데이터를 표준화해 연결합니다." },
      { title: "저장·관리", text: "대용량 데이터를 안정적으로 저장하고 품질을 관리합니다." },
      { title: "분석", text: "업무 목적에 맞는 통계·공간·시계열 분석을 수행합니다." },
      { title: "시각화·API", text: "분석 결과를 대시보드와 API로 제공합니다." },
    ],
    process: [
      { step: "수집", en: "Collect", text: "현장과 시스템에서 데이터를 수집합니다." },
      { step: "연계", en: "Connect", text: "서로 다른 데이터를 표준에 맞춰 연결합니다." },
      { step: "저장", en: "Store", text: "데이터를 안전하게 저장하고 관리합니다." },
      { step: "분석", en: "Analyze", text: "목적에 맞게 데이터를 분석합니다." },
      { step: "시각화", en: "Visualize", text: "결과를 화면과 API로 제공합니다." },
    ],
    applications: [
      { businessSlug: "smart-city", text: "도시 데이터 허브와 통합 데이터 관리" },
      { businessSlug: "geospatial", text: "공간 데이터 구축과 위치 기반 분석" },
      { businessSlug: "road-transportation", text: "교통 데이터 수집·분석" },
    ],
    relatedSolutions: ["rino-datahub", "rino-gis", "rino-iot"],
  },
  "smart-platform": {
    overview:
      "ESE의 Smart Platform 기술은 다양한 시스템과 데이터를 하나의 환경으로 연결해 효율적인 통합 운영 기반을 제공합니다. 새로운 서비스와 시설이 늘어나도 유연하게 확장할 수 있는 구조를 지향합니다.",
    capabilities: [
      { title: "시스템 연계", text: "서로 다른 시스템을 표준 방식으로 연결합니다." },
      { title: "통합 모니터링", text: "여러 시설과 서비스의 상태를 한 화면에서 확인합니다." },
      { title: "서비스 운영", text: "운영자가 업무를 처리하고 서비스를 관리하는 환경을 제공합니다." },
      { title: "확장성", text: "새로운 시스템과 서비스를 손쉽게 추가할 수 있습니다." },
    ],
    process: [
      { step: "연계", en: "Integrate", text: "개별 시스템과 데이터를 연결합니다." },
      { step: "통합", en: "Unify", text: "하나의 운영 환경으로 묶습니다." },
      { step: "모니터링", en: "Monitor", text: "상태와 상황을 실시간으로 확인합니다." },
      { step: "서비스", en: "Serve", text: "운영자와 시민에게 서비스를 제공합니다." },
    ],
    applications: [
      { businessSlug: "smart-city", text: "도시 통합운영 환경" },
      { businessSlug: "disaster-safety", text: "재난 상황 통합 관리" },
      { businessSlug: "global-smart-city", text: "해외 도시 통합운영 플랫폼" },
    ],
    relatedSolutions: ["rino-iot", "rino-fms", "rino-datahub"],
  },
};
