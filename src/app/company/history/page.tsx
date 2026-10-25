import { CitySystemVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { Timeline } from "@/components/subpage/Timeline";
import { historyEras } from "@/content/history";
import { pageMetadata } from "@/lib/seo";

const PATH = "/company/history";

export const metadata = pageMetadata({
  title: "연혁",
  description: "2000년 설립부터 스마트시티 확장, AI·데이터 전환까지 ESE가 걸어온 길입니다.",
  path: PATH,
});

export default function HistoryPage() {
  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="HISTORY"
        title="연혁"
        description="기반 구축에서 스마트시티 확장, 그리고 AI·데이터 전환까지 ESE의 시간을 소개합니다."
        graphic={<CitySystemVisual active={["infra"]} />}
      />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="MAJOR ERA" title="ESE가 걸어온 세 개의 시대">
        <Timeline eras={historyEras} />
      </SubSection>

      <InquiryCTA />
    </>
  );
}
