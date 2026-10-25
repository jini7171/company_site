import Link from "next/link";

/**
 * ESE Wordmark (임시)
 * TODO: 공식 CI/BI 로고 파일(SVG) 수령 시 이 컴포넌트 내부만 교체하세요.
 */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "dark" ? "text-ink" : "text-white";

  return (
    <Link href="/" aria-label="ESE 홈으로 이동" className={`inline-flex min-h-[44px] items-center gap-2.5 ${color} ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7">
        <rect x="0.75" y="0.75" width="26.5" height="26.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8h14M7 14h9M7 20h14" stroke="currentColor" strokeWidth="2.25" />
        <circle cx="21" cy="14" r="2.25" fill="#185ADB" />
      </svg>
      <span className="font-en text-[22px] font-bold tracking-[-0.04em]">ESE</span>
    </Link>
  );
}
