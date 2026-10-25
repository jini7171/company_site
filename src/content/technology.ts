import type { Technology } from "./types";

export const technologies: Technology[] = [
  {
    slug: "ai",
    title: "AI",
    en: "Artificial Intelligence",
    copy: "데이터를 분석하고 예측해\n더 빠르고 정확한 의사결정을 지원합니다.",
    keywords: ["Analysis", "Prediction", "Automation", "Intelligence"],
  },
  {
    slug: "big-data",
    title: "Big Data",
    en: "Data Engineering",
    copy: "데이터의 수집부터 연계, 저장, 분석, 시각화까지\n데이터 활용 전 과정을 통합합니다.",
    keywords: ["Collect", "Connect", "Analyze", "Visualize"],
    capabilities: ["Data Collection", "Integration", "Storage", "Analysis", "Visualization", "API", "Dashboard"],
  },
  {
    slug: "smart-platform",
    title: "Smart Platform",
    en: "Integrated Operation",
    copy: "다양한 시스템과 데이터를 하나의 환경으로 연결해\n효율적인 통합 운영 기반을 제공합니다.",
    keywords: ["Integration", "Monitoring", "Service", "Operation"],
  },
];
