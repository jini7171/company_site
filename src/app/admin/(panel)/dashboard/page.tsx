import { Award, Briefcase, Megaphone, MessageSquareText, Newspaper } from "lucide-react";
import Link from "next/link";
import { Badge, Card, EmptyRow, PageHeader, TextLink, formatDateTime, td, th } from "@/components/admin/ui";
import { VISIT_PERIODS, VisitStats } from "@/components/admin/VisitStats";
import { requireAdmin } from "@/lib/admin";
import { type InquiryStatus, inquiryStatus } from "@/lib/admin-config";

type Props = { searchParams: Promise<{ days?: string }> };

export default async function AdminDashboardPage({ searchParams }: Props) {
  const { days: daysParam } = await searchParams;
  const days = VISIT_PERIODS.find((d) => String(d) === daysParam) ?? VISIT_PERIODS[0];
  const { db } = await requireAdmin();
  const countOf = (table: string, column?: string, value?: string) => {
    const q = db.from(table).select("*", { count: "exact", head: true });
    return column ? q.eq(column, value!) : q;
  };

  const [news, press, projects, certifications, inquiries, newInquiries, recentInquiries, recentNews, recentPress] = await Promise.all([
    countOf("company_board_posts", "category", "news"),
    countOf("company_press"),
    countOf("company_projects"),
    countOf("company_certifications"),
    countOf("company_inquiries"),
    countOf("company_inquiries", "status", "new"),
    db.from("company_inquiries").select("id, name, affiliation, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("company_board_posts").select("id, title, date, published, updated_at").order("updated_at", { ascending: false }).limit(5),
    db.from("company_press").select("id, title, written_date, published, updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);

  // 공지사항·보도자료를 최근 수정 순으로 합칩니다.
  const recentPosts = [
    ...(recentNews.data ?? []).map((p) => ({ kind: "공지사항", href: `/admin/notices?edit=${p.id}`, title: p.title, date: p.date, published: p.published, updatedAt: p.updated_at })),
    ...(recentPress.data ?? []).map((p) => ({ kind: "보도자료", href: `/admin/press?edit=${p.id}`, title: p.title, date: p.written_date, published: p.published, updatedAt: p.updated_at })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  const stats = [
    { label: "공지사항", value: news.count ?? 0, href: "/admin/notices", icon: Megaphone },
    { label: "보도자료", value: press.count ?? 0, href: "/admin/press", icon: Newspaper },
    { label: "사업실적", value: projects.count ?? 0, href: "/admin/projects", icon: Briefcase },
    { label: "인증/특허", value: certifications.count ?? 0, href: "/admin/certifications", icon: Award },
    { label: "문의사항", value: inquiries.count ?? 0, href: "/admin/inquiries", icon: MessageSquareText, alert: newInquiries.count ?? 0 },
  ];

  return (
    <>
      <PageHeader title="대시보드" description="사이트 콘텐츠와 문의 현황을 한눈에 확인합니다." />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {stats.map(({ label, value, href, icon: Icon, alert }) => (
          <li key={label}>
            <Link href={href} className="flex h-full flex-col border border-line bg-white p-5 transition-colors hover:border-brand">
              <span className="flex items-center justify-between text-[14px] font-semibold text-muted">
                {label}
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="mt-4 font-en text-[34px] font-semibold tabular-nums tracking-[-0.03em]">{value}</span>
              {alert ? (
                <span className="mt-1 text-[13px] font-semibold text-red-600">미확인 {alert}건</span>
              ) : (
                <span className="mt-1 text-[13px] text-muted">전체</span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card title="최근 문의" action={<TextLink href="/admin/inquiries">전체 보기</TextLink>}>
          <div className="-m-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>상태</th>
                  <th className={th}>제목</th>
                  <th className={th}>접수일</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.data?.length ? (
                  recentInquiries.data.map((q) => {
                    const s = inquiryStatus[q.status as InquiryStatus];
                    return (
                      <tr key={q.id}>
                        <td className={td}>
                          <Badge tone={s?.tone}>{s?.label ?? q.status}</Badge>
                        </td>
                        <td className={td}>
                          <Link href={`/admin/inquiries?open=${q.id}`} className="font-medium hover:text-brand">
                            {q.subject}
                          </Link>
                          <p className="text-[12px] text-muted">
                            {q.name} · {q.affiliation}
                          </p>
                        </td>
                        <td className={`${td} whitespace-nowrap text-muted`}>{formatDateTime(q.created_at)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <EmptyRow colSpan={3}>접수된 문의가 없습니다.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="최근 수정한 게시물">
          <div className="-m-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>구분</th>
                  <th className={th}>제목</th>
                  <th className={th}>게시일</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length ? (
                  recentPosts.map((p) => (
                    <tr key={p.href}>
                      <td className={td}>
                        <Badge>{p.kind}</Badge>
                      </td>
                      <td className={td}>
                        <Link href={p.href} className="font-medium hover:text-brand">
                          {p.title}
                        </Link>
                        {!p.published && <span className="ml-2 text-[12px] text-muted">(비공개)</span>}
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted`}>{p.date}</td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={3}>등록된 게시물이 없습니다.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <VisitStats days={days} />
    </>
  );
}
