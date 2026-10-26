import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { deleteProject, saveProject } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, Check, EmptyRow, Field, ImageField, PageHeader, ResultBanner, inputCls, primaryBtn, secondaryBtn, td, th } from "@/components/admin/ui";
import { projectCategories, projectImageUrl } from "@/content/projects";
import { requireAdmin } from "@/lib/admin";

type ProjectRow = {
  id: number;
  category: string;
  title: string;
  content: string | null;
  image_path: string;
  start_date: string | null;
  end_date: string | null;
  written_date: string | null;
  published: boolean;
};

type Props = { searchParams: Promise<{ edit?: string; msg?: string; category?: string }> };

const COLUMNS = "id, category, title, content, image_path, start_date, end_date, written_date, published";

export default async function AdminProjectsPage({ searchParams }: Props) {
  const { edit, msg, category } = await searchParams;
  const { db } = await requireAdmin();

  let query = db
    .from("company_projects")
    .select(COLUMNS)
    .order("written_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const projects = ((await query).data ?? []) as ProjectRow[];

  const editId = Number(edit) || null;
  const editing = editId
    ? (projects.find((p) => p.id === editId) ??
      ((await db.from("company_projects").select(COLUMNS).eq("id", editId).maybeSingle()).data as ProjectRow | null) ??
      undefined)
    : undefined;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const filterQs = category ? `&category=${encodeURIComponent(category)}` : "";

  return (
    <>
      <PageHeader
        title="사업실적"
        description="공개된 프로젝트가 사이트의 사업실적 페이지와 사업 분야별 건수에 반영됩니다."
        action={
          <Link href="/business/performance" target="_blank" className={secondaryBtn}>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            사이트에서 보기
          </Link>
        }
      />
      <ResultBanner msg={msg} />

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <Card
          title={`프로젝트 (${projects.length})`}
          action={
            <nav aria-label="프로젝트 분류 필터" className="flex flex-wrap justify-end gap-1 text-[12px]">
              <Link href="?" className={`px-2 py-1 ${!category ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                전체
              </Link>
              {projectCategories.map((c) => (
                <Link
                  key={c.label}
                  href={`?category=${encodeURIComponent(c.label)}`}
                  className={`px-2 py-1 ${category === c.label ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          }
        >
          <div className="-m-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>이미지</th>
                  <th className={th}>프로젝트명</th>
                  <th className={th}>구축기간</th>
                  <th className={th}>작성일</th>
                  <th className={th}>상태</th>
                  <th className={th}>
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length ? (
                  projects.map((p) => (
                    <tr key={p.id} className={p.id === editId ? "bg-brand-50" : undefined}>
                      <td className={td}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- 관리자 목록 썸네일 */}
                        <img src={projectImageUrl(p.image_path)} alt="" className="h-12 w-16 border border-line object-cover" />
                      </td>
                      <td className={td}>
                        <p className="text-[12px] font-semibold text-brand">{p.category}</p>
                        <Link href={`?edit=${p.id}${filterQs}`} className="font-medium hover:text-brand">
                          {p.title}
                        </Link>
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted`}>
                        {p.start_date || p.end_date ? `${p.start_date ?? ""} ~ ${p.end_date ?? ""}` : "-"}
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted`}>{p.written_date ?? "-"}</td>
                      <td className={td}>
                        {p.published ? <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">공개</Badge> : <Badge>비공개</Badge>}
                      </td>
                      <td className={`${td} whitespace-nowrap text-right`}>
                        <form action={deleteProject} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmButton
                            message={`'${p.title}' 프로젝트를 삭제할까요? 이미지도 함께 삭제되며 되돌릴 수 없습니다.`}
                            className="text-[13px] text-red-600 hover:underline"
                          >
                            삭제
                          </ConfirmButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={6}>등록된 프로젝트가 없습니다.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={editing ? "프로젝트 수정" : "새 프로젝트 등록"}
          action={editing && <Link href="?" className="text-[13px] font-semibold text-brand hover:underline">새로 등록</Link>}
        >
          <form key={editing?.id ?? "new"} action={saveProject} className="space-y-5">
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <Field label="프로젝트 분류" required>
              <select name="category" required defaultValue={editing?.category ?? category ?? ""} className={inputCls}>
                <option value="" disabled>
                  선택
                </option>
                {projectCategories.map((c) => (
                  <option key={c.label}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="프로젝트명" required>
              <input name="title" required maxLength={300} defaultValue={editing?.title} className={inputCls} />
            </Field>
            <ImageField currentUrl={editing && projectImageUrl(editing.image_path)} />
            <Field label="내용">
              <textarea name="content" rows={5} maxLength={5000} defaultValue={editing?.content ?? ""} className={`${inputCls} resize-y`} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="구축기간 시작">
                <input name="start_date" type="date" defaultValue={editing?.start_date ?? ""} className={inputCls} />
              </Field>
              <Field label="구축기간 종료">
                <input name="end_date" type="date" defaultValue={editing?.end_date ?? ""} className={inputCls} />
              </Field>
            </div>
            <Field label="작성일">
              <input name="written_date" type="date" defaultValue={editing ? (editing.written_date ?? "") : today} className={inputCls} />
            </Field>
            <Check name="published" label="사이트에 공개" defaultChecked={editing?.published ?? true} />
            <div className="flex gap-2 border-t border-line pt-5">
              <button type="submit" className={primaryBtn}>
                {editing ? "수정 저장" : "등록"}
              </button>
              {editing && (
                <Link href="?" className={secondaryBtn}>
                  취소
                </Link>
              )}
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
