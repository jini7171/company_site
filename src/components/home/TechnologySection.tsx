import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechnologyDiagram } from "./TechnologyDiagram";

export function TechnologySection() {
  return (
    <section id="technology" aria-labelledby="technology-title" className="relative overflow-hidden bg-night py-24 text-white md:py-28 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center lg:py-12">
      <div className="container relative max-w-content">
        <SectionHeader
          id="technology-title"
          index="03"
          tone="dark"
          eyebrow="CORE TECHNOLOGY"
          title="경험을 기술로 연결합니다"
          aside={
            <p className="font-en text-eyebrow font-medium text-white/50">
              TECHNOLOGY = <span className="text-cyan">HOW WE BUILD</span>
            </p>
          }
        />

        <div className="mt-20 md:mt-24 lg:mt-14" data-reveal>
          <TechnologyDiagram />
        </div>
      </div>
    </section>
  );
}
