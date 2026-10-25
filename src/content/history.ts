import type { HistoryEra } from "./types";

/**
 * 연혁 — Timeline + Major Era
 * TODO: 공식 연혁 Milestone 입력 (설립일 외 항목은 확인 후 추가)
 */
export const historyEras: HistoryEra[] = [
  {
    period: "2000–2009",
    title: "기반 구축",
    en: "Foundation",
    milestones: [{ year: 2000, month: 4, text: "ESE Co., Ltd. 설립" }],
  },
  {
    period: "2010–2019",
    title: "스마트시티 확장",
    en: "Smart City Expansion",
    milestones: [],
  },
  {
    period: "2020–",
    title: "AI · 데이터 전환",
    en: "AI & Data Transformation",
    milestones: [],
  },
];
