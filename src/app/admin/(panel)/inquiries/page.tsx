import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { deleteInquiry, updateInquiry } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, Field, PageHeader, ResultBanner, formatDateTime, inputCls, primaryBtn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { type InquiryStatus, inquiryStatus } from "@/lib/admin-config";

type InquiryRow = {
  id: number;
  name: string;
  affiliation: string;
  position: string | null;
  phone: string | null;
  email: string;
  type: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  admin_memo: string | null;
  answered_at: string | null;
  created_at: string;
};

type Props = { searchParams: Promise<{ status?: string; open?: string; msg?: string }> };

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const { status, open, msg } = await searchParams;
  const { db } = await requireAdmin();
  const filter = status && status in inquiryStatus ? (status as InquiryStatus) : undefined;

  let query = db.from("company_inquiries").select("*").order("created_at", { ascending: false });
  if (filter) query = query.eq("status", filter);
  const inquiries = ((await query).data ?? []) as InquiryRow[];
  const back = filter ? `/admin/inquiries?status=${filter}` : "/admin/inquiries";

  const tabs = [{ key: undefined, label: "전체" }, ...Object.entries(inquiryStatus).map(([key, s]) => ({ key, label: s.label }))];

  return (
    <>
      <PageHeader title="문의사항" description="사이트 '사업문의'로 접수된 내용입니다. 처리 상태와 답변 메모를 기록하세요." />
      <ResultBanner msg={msg} />

      <nav aria-label="처리 상태 필터" className="mb-4 flex flex-wrap gap-1">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `?status=${t.key}` : "?"}
            className={`min-h-[36px] px-4 py-2 text-[13px] font-semibold ${filter === t.key ? "bg-ink text-white" : "border border-line bg-white text-muted hover:text-ink"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <Card>
        {inquiries.length ? (
          <ul className="-m-5 divide-y divide-line">
            {inquiries.map((q) => {
              const s = inquiryStatus[q.status];
              return (
                <li key={q.id}>
                  <details open={String(q.id) === open} className="group">
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-subtle [&::-webkit-details-marker]:hidden">
                      <Badge tone={s?.tone}>{s?.label ?? q.status}</Badge>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{q.subject}</span>
                        <span className="block text-[12px] text-muted">
                          {q.name} · {q.affiliation} · {q.type}
                        </span>
                      </span>
                      <span className="hidden whitespace-nowrap text-[13px] text-muted sm:block">{formatDateTime(q.created_at)}</span>
                      <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="grid gap-6 border-t border-line bg-subtle/60 px-5 py-6 lg:grid-cols-[1fr_360px]">
                      <div>
                        <dl className="grid grid-cols-[5rem_1fr] gap-y-2 text-[14px]">
                          <dt className="text-muted">이름</dt>
                          <dd>
                            {q.name}
                            {q.position && <span className="text-muted"> ({q.position})</span>}
                          </dd>
                          <dt className="text-muted">소속</dt>
                          <dd>{q.affiliation}</dd>
                          <dt className="text-muted">이메일</dt>
                          <dd>
                            <a href={`mailto:${q.email}`} className="text-brand hover:underline">
                              {q.email}
                            </a>
                          </dd>
                          <dt className="text-muted">연락처</dt>
                          <dd>{q.phone ?? "-"}</dd>
                          <dt className="text-muted">문의 유형</dt>
                          <dd>{q.type}</dd>
                        </dl>
                        <p className="mt-5 whitespace-pre-wrap border border-line bg-white p-4 text-[14px] leading-[1.7]">{q.message}</p>
                      </div>

                      <div className="space-y-4">
                        <form action={updateInquiry} className="space-y-4 border border-line bg-white p-4">
                          <input type="hidden" name="id" value={q.id} />
                          <input type="hidden" name="back" value={back} />
                          <Field label="처리 상태">
                            <select name="status" defaultValue={q.status} className={inputCls}>
                              {Object.entries(inquiryStatus).map(([key, v]) => (
                                <option key={key} value={key}>
                                  {v.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="답변 메모" hint="회신 내용이나 담당자 메모 (사이트에는 공개되지 않음)">
                            <textarea name="admin_memo" rows={4} maxLength={5000} defaultValue={q.admin_memo ?? ""} className={`${inputCls} resize-y`} />
                          </Field>
                          {q.answered_at && <p className="text-[12px] text-muted">답변 완료: {formatDateTime(q.answered_at)}</p>}
                          <button type="submit" className={primaryBtn}>
                            저장
                          </button>
                        </form>
                        <form action={deleteInquiry} className="text-right">
                          <input type="hidden" name="id" value={q.id} />
                          <ConfirmButton message="이 문의를 삭제할까요? 되돌릴 수 없습니다." className="text-[13px] text-red-600 hover:underline">
                            문의 삭제
                          </ConfirmButton>
                        </form>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-12 text-center text-[14px] text-muted">{filter ? "해당 상태의 문의가 없습니다." : "접수된 문의가 없습니다."}</p>
        )}
      </Card>
    </>
  );
}
