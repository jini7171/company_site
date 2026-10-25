import { SectionHeader } from "@/components/ui/SectionHeader";
import { businessAreas } from "@/content/business";
import { revealDelay } from "@/lib/motion";
import { BusinessCard, BusinessFeatureCard } from "./BusinessCard";

export function BusinessSection() {
  const featured = businessAreas.find((area) => area.featured) ?? businessAreas[0];
  const others = businessAreas.filter((area) => area !== featured);

  return (
    <section id="business" aria-labelledby="business-title" className="py-24 md:py-28 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center lg:py-12">
      <div className="container max-w-content">
        <SectionHeader
          id="business-title"
          index="02"
          eyebrow="OUR BUSINESS"
          title={
            <>
              도시의 다양한 문제를
              <br />
              스마트 기술로 해결합니다
            </>
          }
          aside={
            <p className="font-en text-eyebrow font-medium text-muted">
              BUSINESS = <span className="text-brand">WHERE WE APPLY</span>
            </p>
          }
        />

        <div className="mt-16 grid gap-10 md:mt-20 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-reveal>
            <BusinessFeatureCard area={featured} />
          </div>
          <ul className="flex flex-col justify-center border-t border-line lg:col-span-5 lg:border-t-0 lg:[&>li:first-child>a]:border-t">
            {others.map((area, i) => (
              <li key={area.slug} data-reveal style={revealDelay(i * 90)}>
                <BusinessCard area={area} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
