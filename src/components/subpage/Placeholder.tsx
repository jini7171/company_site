import { Clock } from "lucide-react";
import type { ReactNode } from "react";

/** 확정되지 않은 정보 영역 — 임의 데이터를 만들지 않고 명시적으로 비워둡니다. */
export function Placeholder({ children = "정보를 준비하고 있습니다.", tone = "light" }: { children?: ReactNode; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex items-center gap-3 border border-dashed px-6 py-6 text-[15px] ${
        dark ? "border-white/20 text-white/55" : "border-line-strong bg-white text-muted"
      }`}
    >
      <Clock aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
