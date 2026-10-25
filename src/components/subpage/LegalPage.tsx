import { Placeholder } from "./Placeholder";

/**
 * 약관 페이지 공통 틀
 * TODO: 법무 검토를 거친 공식 본문을 받아 children으로 넣으세요. 임의로 작성하지 마세요.
 */
export function LegalPage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-[880px]">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 text-[clamp(2rem,3.6vw,2.75rem)] font-bold tracking-[-0.03em]">{title}</h1>
        <div className="mt-12 border-t border-ink pt-10">
          <Placeholder>공식 {title} 본문을 준비하고 있습니다.</Placeholder>
        </div>
      </div>
    </section>
  );
}
