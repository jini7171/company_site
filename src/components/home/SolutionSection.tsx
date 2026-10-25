import { SectionHeader } from "@/components/ui/SectionHeader";
import { solutions } from "@/content/solutions";
import { revealDelay } from "@/lib/motion";
import { SolutionCard } from "./SolutionCard";

export function SolutionSection() {
  return (
    <section
      id="solution"
      aria-labelledby="solution-title"
      className="py-24 md:py-28 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center lg:py-12"
    >
      {/* Desktop: 좌측 Header + 우측 3×3 Grid로 배치해 한 화면 높이에 맞춥니다. */}
      <div className="container grid max-w-content gap-16 md:gap-20 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeader
            id="solution-title"
            index="04"
            layout="stacked"
            eyebrow="ESE SOLUTION"
            title={
              <>
                도시 운영을 위한
                <br />
                ESE의 <span className="font-en tracking-[-0.04em]">rino</span> Solution
              </>
            }
            description={
              <>
                도시 인프라부터 데이터, 관제, 시설관리까지
                <br className="hidden md:block" /> 스마트한 도시 운영을 지원하는 다양한 솔루션을 제공합니다.
              </>
            }
            aside={<p className="font-en text-eyebrow font-medium text-muted">{solutions.length} PRODUCTS</p>}
          />
        </div>

        <ul className="grid gap-px border border-line bg-line md:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <li key={solution.slug} data-reveal style={revealDelay((i % 3) * 80)}>
              <SolutionCard solution={solution} index={i} total={solutions.length} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
