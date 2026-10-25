import type { CoreValue } from "./types";

/**
 * Company 페이지 Content
 * TODO: 비전 문구와 핵심가치는 공식 확정 전 Placeholder입니다. 경영진 확인 후 수정하세요.
 */
export const companyMessage = "기술은 변하지만, 경험은 축적됩니다.";

export const companyIntro =
  "ESE는 2000년 설립 이후 스마트시티, 재난안전, 국토공간정보, 도로교통 분야에서 도시의 문제를 기술로 해결해왔습니다. 현장에서 쌓은 프로젝트 경험을 바탕으로 AI, Big Data, Smart Platform 기술을 연결해 도시의 새로운 운영 방식을 만들어갑니다.";

export const companyPhilosophy = [
  { en: "Field First", title: "현장에서 출발합니다", text: "기술은 실제 도시 현장의 문제를 해결할 때 의미가 있다고 믿습니다." },
  { en: "Long-term Partner", title: "오래 함께합니다", text: "구축으로 끝나지 않고 운영과 개선까지 함께하는 파트너가 되고자 합니다." },
  { en: "Connected Thinking", title: "연결해서 생각합니다", text: "인프라, 데이터, 기술, 서비스를 하나의 흐름으로 바라봅니다." },
];

export const vision = {
  statement: "Experience-Driven Smart Innovation",
  headline: "경험을 바탕으로\n더 스마트한 도시의 내일을 만듭니다",
  text: "ESE는 Smart City, AI, Data를 하나로 연결해 도시가 더 안전하고 효율적으로 운영될 수 있는 기반을 만듭니다.",
};

export const coreValues: CoreValue[] = [
  { en: "Experience", title: "경험", text: "현장에서 쌓은 경험을 가장 중요한 자산으로 여깁니다." },
  { en: "Connection", title: "연결", text: "사람, 데이터, 시스템을 연결해 더 큰 가치를 만듭니다." },
  { en: "Intelligence", title: "지능", text: "데이터와 AI로 더 나은 판단을 돕습니다." },
  { en: "Innovation", title: "혁신", text: "익숙한 방식에 머무르지 않고 더 나은 방법을 찾습니다." },
];

/** 오시는 길 — TODO: 공식 주소·교통편 입력. 주소 확정 후 지도 Embed를 추가하세요. */
export const locationInfo = {
  address: null as string | null,
  transit: [] as { type: string; text: string }[],
  parking: null as string | null,
};
