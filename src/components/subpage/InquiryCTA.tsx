import { Button } from "@/components/ui/Button";
import { inquiryHref } from "@/content/navigation";

/** Subpage 하단 공통 사업 문의 띠 */
export function InquiryCTA({ title = "더 스마트한 도시를 위한\n새로운 가능성을 함께 만들어갑니다" }: { title?: string }) {
  return (
    <section className="relative overflow-hidden bg-night py-20 text-white md:py-24">
      <div aria-hidden="true" className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-brand/20 blur-[140px]" />
      <div className="container relative flex max-w-content flex-col gap-10 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="eyebrow text-cyan">LET&apos;S BUILD TOGETHER</p>
          <h2 className="mt-6 whitespace-pre-line font-kr text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.3] tracking-[-0.03em]">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href={inquiryHref}>사업 문의하기</Button>
        </div>
      </div>
    </section>
  );
}
