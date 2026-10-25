type Step = { step: string; en: string; text: string };

/** 단계형 Process — Desktop 가로 흐름 / Mobile 세로 흐름 */
export function ProcessFlow({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-8 md:auto-cols-fr md:grid-flow-col md:gap-0">
      {steps.map((s, i) => (
        <li key={s.en} className="relative flex gap-5 md:flex-col md:gap-0 md:pr-6">
          {/* 다음 단계로 이어지는 연결선 */}
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[19px] top-10 h-[calc(100%-8px)] w-px bg-line md:left-10 md:right-0 md:top-[19px] md:h-px md:w-auto"
            >
              <span className="flow-rail absolute inset-0 hidden text-brand/60 motion-safe:md:block" />
            </span>
          )}
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand bg-white font-en text-[13px] font-semibold text-brand">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="md:mt-6">
            <p className="font-en text-eyebrow font-semibold uppercase text-muted">{s.en}</p>
            <h3 className="mt-2 text-[19px] font-bold tracking-[-0.02em]">{s.step}</h3>
            <p className="mt-2 text-[15px] leading-[1.7] text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
