import type { TitledText } from "@/content/types";

type FeatureGridProps = {
  items: TitledText[];
  columns?: 2 | 3;
  tone?: "light" | "dark";
};

/** 번호가 붙은 항목 Grid — Challenges, Capabilities, Key Features 등에 사용 */
export function FeatureGrid({ items, columns = 2, tone = "light" }: FeatureGridProps) {
  const dark = tone === "dark";

  return (
    <ul
      className={`grid gap-px border ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} ${
        dark ? "border-white/10 bg-white/10" : "border-line bg-line"
      }`}
    >
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`group flex flex-col p-7 transition-colors duration-500 md:p-8 ${
            dark ? "bg-night hover:bg-night-700" : "bg-white hover:bg-brand-50/50"
          }`}
        >
          <span className={`font-en text-[13px] font-semibold ${dark ? "text-cyan" : "text-brand"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-[20px] font-bold tracking-[-0.02em]">{item.title}</h3>
          <p className={`mt-3 text-[15px] leading-[1.75] ${dark ? "text-white/65" : "text-muted"}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
