import Link from "next/link";
import { legalLinks, mainNavigation } from "@/content/navigation";
import { requireAdmin } from "@/lib/admin";
import { Card } from "./ui";

type Stats = {
  days: number;
  page_views: number;
  visitors: number;
  visits: number;
  today_visitors: number;
  daily: { date: string; visitors: number; page_views: number }[];
  devices: { device: "mobile" | "tablet" | "desktop"; visitors: number }[];
  referrers: { source: string; visits: number }[];
  pages: { path: string; views: number }[];
};

export const VISIT_PERIODS = [7, 30, 90] as const;

const DEVICE_LABEL = { mobile: "모바일", tablet: "태블릿", desktop: "PC (웹)" };

const PAGE_LABELS: Record<string, string> = Object.fromEntries([
  ["/", "홈"],
  ...mainNavigation.flatMap((g) => g.links.map((l) => [l.href, l.label])),
  ...legalLinks.map((l) => [l.href, l.label]),
]);
const pageLabel = (path: string) => PAGE_LABELS[path] ?? path;

const fmt = (n: number) => n.toLocaleString("ko-KR");
const shortDate = (d: string) => `${Number(d.slice(5, 7))}.${Number(d.slice(8, 10))}`;

/** 관리자 대시보드 방문 통계 — 단일 색(brand) 막대만 쓰고, 값은 항상 글자로 함께 보여줍니다. */
export async function VisitStats({ days }: { days: number }) {
  const { db } = await requireAdmin();
  const { data, error } = await db.rpc("company_visit_stats", { p_days: days });
  const stats = data as Stats | null;

  return (
    <section aria-labelledby="visit-stats-title" className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="visit-stats-title" className="text-[20px] font-bold tracking-[-0.02em]">
            방문 통계
          </h2>
          <p className="mt-1 text-[13px] text-muted">홈페이지 방문 기록 (관리자 화면 제외, 한국 시간 기준)</p>
        </div>
        <nav aria-label="기간" className="flex gap-1">
          {VISIT_PERIODS.map((d) => (
            <Link
              key={d}
              href={`?days=${d}`}
              scroll={false}
              aria-current={d === days ? "page" : undefined}
              className={`min-h-[36px] px-4 py-2 text-[13px] font-semibold ${d === days ? "bg-ink text-white" : "border border-line bg-white text-muted hover:text-ink"}`}
            >
              최근 {d}일
            </Link>
          ))}
        </nav>
      </div>

      {error || !stats ? (
        <Card>
          <p className="py-8 text-center text-[14px] text-muted">방문 통계를 불러오지 못했습니다.</p>
        </Card>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "방문자 수", value: stats.visitors, hint: `최근 ${stats.days}일 · 중복 제외` },
              { label: "방문 수", value: stats.visits, hint: "방문(세션) 횟수" },
              { label: "페이지뷰", value: stats.page_views, hint: "열어본 페이지 수" },
              { label: "오늘 방문자", value: stats.today_visitors, hint: "오늘 0시부터" },
            ].map((k) => (
              <li key={k.label} className="border border-line bg-white p-5">
                <p className="text-[14px] font-semibold text-muted">{k.label}</p>
                <p className="mt-3 font-en text-[30px] font-semibold tabular-nums tracking-[-0.03em]">{fmt(k.value)}</p>
                <p className="mt-1 text-[12px] text-muted">{k.hint}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Card title="일별 방문자">
              <DailyChart daily={stats.daily} />
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card title="기기 (모바일 / 웹)">
              <BarList
                rows={stats.devices.map((d) => ({ label: DEVICE_LABEL[d.device] ?? d.device, value: d.visitors }))}
                unit="명"
                showShare
                empty="기록이 없습니다."
              />
            </Card>
            <Card title="유입 경로">
              <BarList rows={stats.referrers.map((r) => ({ label: r.source, value: r.visits }))} unit="회" showShare empty="기록이 없습니다." />
            </Card>
            <Card title="많이 본 페이지">
              <BarList rows={stats.pages.map((p) => ({ label: pageLabel(p.path), sub: p.path, value: p.views }))} unit="회" empty="기록이 없습니다." />
            </Card>
          </div>
        </>
      )}
    </section>
  );
}

/** 일별 막대 — 막대마다 hover 시 날짜·방문자·페이지뷰를 보여주고, 같은 값을 표로도 제공합니다. */
function DailyChart({ daily }: { daily: Stats["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.visitors));
  // 기간이 길면 축 날짜는 일부만 표시합니다.
  const labelEvery = daily.length <= 10 ? 1 : Math.ceil(daily.length / 8);

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="flex h-[180px] flex-col justify-between pb-6 text-right font-en text-[11px] tabular-nums text-muted">
          <span>{fmt(max)}</span>
          <span>0</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex h-[156px] items-end gap-[2px] border-b border-line-strong" aria-hidden="true">
            {daily.map((d) => (
              <div key={d.date} className="group relative flex h-full flex-1 items-end">
                <div className="w-full rounded-t-[4px] bg-brand transition-colors group-hover:bg-brand-700" style={{ height: `${(d.visitors / max) * 100}%`, minHeight: d.visitors ? 2 : 0 }} />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-line bg-white px-3 py-2 text-[12px] shadow-sm group-hover:block">
                  <p className="font-semibold">{d.date}</p>
                  <p className="text-ink/80">방문자 {fmt(d.visitors)}명</p>
                  <p className="text-muted">페이지뷰 {fmt(d.page_views)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-[2px] font-en text-[11px] tabular-nums text-muted" aria-hidden="true">
            {daily.map((d, i) => (
              <span key={d.date} className="flex-1 text-center">
                {i % labelEvery === 0 || i === daily.length - 1 ? shortDate(d.date) : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>일별 방문자</caption>
        <thead>
          <tr>
            <th>날짜</th>
            <th>방문자</th>
            <th>페이지뷰</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.visitors}</td>
              <td>{d.page_views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** 가로 막대 순위 — 막대 길이는 최댓값 대비, 수치·비율은 글자로 표시합니다. */
function BarList({
  rows,
  unit,
  showShare,
  empty,
}: {
  rows: { label: string; sub?: string; value: number }[];
  unit: string;
  showShare?: boolean;
  empty: string;
}) {
  if (!rows.length) return <p className="py-6 text-center text-[14px] text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value));
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.sub ?? r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px]">
            <span className="min-w-0 truncate" title={r.sub}>
              {r.label}
              {r.sub && r.sub !== r.label && <span className="ml-2 text-[12px] text-muted">{r.sub}</span>}
            </span>
            <span className="shrink-0 tabular-nums text-ink/80">
              {fmt(r.value)}
              {unit}
              {showShare && <span className="ml-1.5 text-muted">{Math.round((r.value / total) * 100)}%</span>}
            </span>
          </div>
          <div className="h-2 bg-subtle">
            <div className="h-full rounded-r-[4px] bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
