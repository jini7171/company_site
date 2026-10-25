import type { BusinessDetail } from "./types";

/**
 * 사업 분야 상세 페이지 Content
 *
 * TODO: 아래 문구는 사업 분야의 일반적인 범위를 기준으로 작성한 **초안**입니다.
 * - 실제 수행 범위·서비스 명칭은 담당 부서 검토 후 수정하세요.
 * - relatedSolutions는 제품명 기준으로 임시 연결한 값입니다. 공식 매핑으로 교체하세요.
 * - 수행 건수·지역 등 실적 수치는 business.ts의 businessPerformance에서 관리합니다.
 */
export const businessDetails: Record<string, BusinessDetail> = {
  "smart-city": {
    overview:
      "스마트시티는 도시의 인프라와 데이터, 서비스를 하나의 체계로 연결해 도시 운영의 효율과 시민 서비스의 질을 함께 높이는 사업입니다. ESE는 현장 인프라에서 수집되는 데이터를 통합운영 환경으로 연결하고, 이를 실제 도시 운영에 활용할 수 있도록 지원합니다.",
    challenges: [
      { title: "분산된 도시 시스템", text: "부서와 시설별로 따로 운영되는 시스템은 정보를 단절시키고 상황 판단을 늦춥니다." },
      { title: "활용되지 못하는 데이터", text: "수집된 도시 데이터가 운영 의사결정으로 이어지지 못하는 경우가 많습니다." },
      { title: "늘어나는 운영 부담", text: "도시 시설과 서비스는 늘어나지만 이를 운영할 인력과 예산은 한정되어 있습니다." },
    ],
    capabilities: [
      { title: "통합운영 환경 구축", text: "여러 시스템과 데이터를 하나의 운영 화면과 체계로 통합합니다." },
      { title: "도시 데이터 연계", text: "기관과 시설에 흩어진 데이터를 표준화해 서로 연결합니다." },
      { title: "현장 인프라 연동", text: "센서, 영상, 시설물 등 현장 인프라를 운영 환경과 연동합니다." },
      { title: "운영 현황 시각화", text: "도시 상황을 한눈에 파악할 수 있도록 지도와 대시보드로 보여줍니다." },
    ],
    services: ["도시 통합운영", "스마트 안전·방범", "도시 데이터 허브", "시설물 모니터링", "시민 서비스 연계"],
    relatedTechnologies: ["smart-platform", "big-data", "ai"],
    relatedSolutions: ["rino-datahub", "rino-iot", "rino-vms", "rino-gis"],
  },
  "disaster-safety": {
    overview:
      "재난안전 사업은 위험 징후를 조기에 감지하고, 상황을 관계 기관과 빠르게 공유해 신속한 대응이 가능하도록 돕는 사업입니다. ESE는 현장 감시부터 상황 전파, 대응 지원까지 이어지는 안전 관리 체계를 구축합니다.",
    challenges: [
      { title: "늦은 위험 감지", text: "징후를 늦게 발견하면 대응할 수 있는 시간이 그만큼 줄어듭니다." },
      { title: "상황 전파의 지연", text: "기관과 현장 사이 정보 전달이 늦어지면 초기 대응이 어려워집니다." },
      { title: "기관 간 협업의 어려움", text: "서로 다른 시스템을 쓰는 기관이 같은 상황을 함께 보기 어렵습니다." },
    ],
    capabilities: [
      { title: "실시간 감시", text: "센서와 영상으로 위험 지역과 시설을 상시 모니터링합니다." },
      { title: "경보·전파", text: "위험 상황을 정해진 기준에 따라 관계자에게 빠르게 알립니다." },
      { title: "상황 공유", text: "현장 정보를 지도와 화면으로 관계 기관이 함께 확인합니다." },
      { title: "대응 지원", text: "축적된 데이터를 바탕으로 대응 판단에 필요한 정보를 제공합니다." },
    ],
    services: ["재난 감시·예경보", "재난 상황관리", "방재 시설 모니터링", "경보 전파", "안전 데이터 분석"],
    relatedTechnologies: ["ai", "big-data", "smart-platform"],
    relatedSolutions: ["rino-sos", "rino-vms", "rino-iot"],
  },
  "global-smart-city": {
    overview:
      "해외 스마트시티 사업은 국내에서 축적한 스마트시티 구축·운영 경험을 해외 도시의 환경과 요구에 맞게 적용하는 사업입니다. ESE는 현지 파트너와 협력해 도시 여건에 맞는 스마트시티 모델을 함께 만들어갑니다.",
    challenges: [
      { title: "서로 다른 도시 환경", text: "도시마다 인프라 수준, 제도, 운영 방식이 달라 그대로 적용하기 어렵습니다." },
      { title: "장기 운영 역량", text: "구축 이후에도 현지에서 스스로 운영할 수 있는 역량이 필요합니다." },
      { title: "협력 체계 구성", text: "현지 기관·기업과의 협력 없이는 사업을 지속하기 어렵습니다." },
    ],
    capabilities: [
      { title: "현지화 설계", text: "현지 도시 여건과 요구에 맞춰 서비스와 시스템을 설계합니다." },
      { title: "검증된 모델 적용", text: "국내 사업에서 검증한 구축·운영 방식을 바탕으로 접근합니다." },
      { title: "파트너십 기반 추진", text: "현지 파트너와 역할을 나눠 사업을 함께 추진합니다." },
      { title: "운영 역량 이전", text: "교육과 기술 지원으로 현지 운영 역량을 높입니다." },
    ],
    services: ["스마트시티 계획 지원", "통합운영 플랫폼 구축", "현지 파트너 협력", "운영 교육·기술 지원"],
    relatedTechnologies: ["smart-platform", "big-data", "ai"],
    relatedSolutions: ["rino-datahub", "rino-gis", "rino-iot"],
  },
  geospatial: {
    overview:
      "국토공간정보 사업은 국토와 도시의 공간 데이터를 정확하게 구축하고, 이를 분석·활용할 수 있는 기반을 만드는 사업입니다. ESE는 공간정보 구축부터 GIS 기반 분석과 서비스까지 공간 데이터 활용 전 과정을 지원합니다.",
    challenges: [
      { title: "데이터 정확도와 최신성", text: "공간 데이터가 현실과 다르거나 오래되면 판단의 근거가 흔들립니다." },
      { title: "흩어진 공간 데이터", text: "기관별로 따로 관리되는 공간 데이터는 함께 활용하기 어렵습니다." },
      { title: "활용 서비스의 부족", text: "구축한 데이터를 업무와 서비스에 연결하는 도구가 필요합니다." },
    ],
    capabilities: [
      { title: "공간 DB 구축", text: "지형, 시설, 행정 정보를 표준에 맞춰 공간 데이터로 구축합니다." },
      { title: "공간 분석", text: "위치와 관계를 기반으로 공간 데이터를 분석합니다." },
      { title: "지도 서비스", text: "업무와 대국민 서비스에 필요한 지도 기반 화면을 제공합니다." },
      { title: "데이터 연계", text: "다른 시스템의 데이터를 위치 기준으로 연결합니다." },
    ],
    services: ["공간정보 DB 구축", "GIS 플랫폼 구축", "공간 분석 서비스", "지도 기반 업무 시스템"],
    relatedTechnologies: ["big-data", "smart-platform", "ai"],
    relatedSolutions: ["rino-gis", "rino-datahub", "rino-fms"],
  },
  "road-transportation": {
    overview:
      "도로교통 사업은 도로와 교통 흐름에 관한 데이터를 수집·분석해 안전하고 효율적인 이동 환경을 만드는 사업입니다. ESE는 교통 정보 수집부터 도로 시설물 관리, 교통 흐름 분석까지 도로 운영 전반을 지원합니다.",
    challenges: [
      { title: "교통 상황의 실시간 파악", text: "도로 상황을 늦게 알면 정체와 사고 대응이 늦어집니다." },
      { title: "도로 시설물 노후화", text: "늘어나는 도로 시설물의 상태를 꾸준히 관리하기 어렵습니다." },
      { title: "데이터 기반 교통 정책", text: "교통 정책과 운영에 근거가 되는 데이터가 필요합니다." },
    ],
    capabilities: [
      { title: "교통 정보 수집", text: "검지기와 영상 등으로 도로 교통 정보를 수집합니다." },
      { title: "시설물 관리", text: "도로 시설물의 이력과 상태를 체계적으로 관리합니다." },
      { title: "교통 흐름 분석", text: "축적된 교통 데이터로 흐름과 패턴을 분석합니다." },
      { title: "운영 현황 제공", text: "도로 상황을 운영자와 이용자에게 알기 쉽게 제공합니다." },
    ],
    services: ["교통 정보 수집·제공", "도로 시설물 관리", "교통 데이터 분석", "도로 안전 모니터링"],
    relatedTechnologies: ["big-data", "ai", "smart-platform"],
    relatedSolutions: ["rino-vms", "rino-fms", "rino-iot"],
  },
};
