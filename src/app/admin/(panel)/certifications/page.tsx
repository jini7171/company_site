import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { deleteCertification, deleteCertificationCategory, saveCertification, saveCertificationCategory } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, Check, EmptyRow, Field, ImageField, PageHeader, ResultBanner, inputCls, primaryBtn, secondaryBtn, td, th } from "@/components/admin/ui";
import { MoveButtons, SortControls } from "@/components/admin/SortControls";
import { certificationImageUrl } from "@/content/certifications";
import { requireAdmin } from "@/lib/admin";
import { applySort, fetchSortMode } from "@/lib/sorting";

type CertificationRow = {
  id: number;
  category: string;
  title: string;
  content: string | null;
  image_path: string;
  written_date: string;
  author: string | null;
  published: boolean;
};

type Props = { searchParams: Promise<{ edit?: string; msg?: string; category?: string }> };

const COLUMNS = "id, category, title, content, image_path, written_date, author, published";

export default async function AdminCertificationsPage({ searchParams }: Props) {
  const { edit, msg, category } = await searchParams;
  const { db } = await requireAdmin();

  const mode = await fetchSortMode(db, "certifications");
  // 순서 화살표는 '전체' 목록에서만 보여줍니다. (분류 필터 중에는 이웃 글이 달라 헷갈리므로)
  const canMove = mode === "manual" && !category;
  let query = applySort(db.from("company_certifications").select(COLUMNS), "certifications", mode);
  if (category) query = query.eq("category", category);
  const [{ data }, { data: categoryRows }, { data: usage }] = await Promise.all([
    query,
    db.from("company_certification_categories").select("name, sort_order").order("sort_order").order("name"),
    db.from("company_certifications").select("category"),
  ]);
  const items = (data ?? []) as CertificationRow[];
  const categories = (categoryRows ?? []) as { name: string; sort_order: number }[];
  const usageCount = (name: string) => (usage ?? []).filter((u) => u.category === name).length;

  const editId = Number(edit) || null;
  const editing = editId
    ? (items.find((c) => c.id === editId) ??
      ((await db.from("company_certifications").select(COLUMNS).eq("id", editId).maybeSingle()).data as CertificationRow | null) ??
      undefined)
    : undefined;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const filterQs = category ? `&category=${encodeURIComponent(category)}` : "";

  return (
    <>
      <PageHeader
        title="인증/특허"
        description="공개된 항목이 사이트의 Company > 인증·특허 페이지에 이미지 게시판으로 표시됩니다."
        action={
          <Link href="/company/certifications" target="_blank" className={secondaryBtn}>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            사이트에서 보기
          </Link>
        }
      />
      <ResultBanner msg={msg} />
      <SortControls board="certifications" mode={mode} note={mode === "manual" ? "순서는 '전체' 목록에서 바꿀 수 있고, 분류 탭에서도 같은 순서로 보입니다." : undefined} />

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <Card
          title={`목록 (${items.length})`}
          action={
            <nav aria-label="분류 필터" className="flex flex-wrap justify-end gap-1 text-[12px]">
              <Link href="?" className={`px-2 py-1 ${!category ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                전체
              </Link>
              {categories.map(({ name }) => (
                <Link key={name} href={`?category=${encodeURIComponent(name)}`} className={`px-2 py-1 ${category === name ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                  {name}
                </Link>
              ))}
            </nav>
          }
        >
          <div className="-m-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {canMove && <th className={th}>순서</th>}
                  <th className={th}>이미지</th>
                  <th className={th}>제목</th>
                  <th className={th}>작성일</th>
                  <th className={th}>작성자</th>
                  <th className={th}>상태</th>
                  <th className={th}>
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((c, i) => (
                    <tr key={c.id} className={c.id === editId ? "bg-brand-50" : undefined}>
                      {canMove && (
                        <td className={`${td} whitespace-nowrap`}>
                          <MoveButtons board="certifications" id={c.id} title={c.title} isFirst={i === 0} isLast={i === items.length - 1} />
                        </td>
                      )}
                      <td className={td}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- 관리자 목록 썸네일 */}
                        <img src={certificationImageUrl(c.image_path)} alt="" className="h-14 w-11 border border-line bg-subtle object-contain" />
                      </td>
                      <td className={td}>
                        <p className="text-[12px] font-semibold text-brand">{c.category}</p>
                        <Link href={`?edit=${c.id}${filterQs}`} className="font-medium hover:text-brand">
                          {c.title}
                        </Link>
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted`}>{c.written_date}</td>
                      <td className={`${td} whitespace-nowrap text-muted`}>{c.author ?? "-"}</td>
                      <td className={td}>
                        {c.published ? <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">공개</Badge> : <Badge>비공개</Badge>}
                      </td>
                      <td className={`${td} whitespace-nowrap text-right`}>
                        <form action={deleteCertification} className="inline">
                          <input type="hidden" name="id" value={c.id} />
                          <ConfirmButton
                            message={`'${c.title}' 항목을 삭제할까요? 이미지도 함께 삭제되며 되돌릴 수 없습니다.`}
                            className="text-[13px] text-red-600 hover:underline"
                          >
                            삭제
                          </ConfirmButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={canMove ? 7 : 6}>등록된 인증/특허가 없습니다.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={editing ? "인증/특허 수정" : "새 인증/특허 등록"}
          action={editing && <Link href="?" className="text-[13px] font-semibold text-brand hover:underline">새로 등록</Link>}
        >
          <form key={editing?.id ?? "new"} action={saveCertification} className="space-y-5">
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <Field label="분류" required>
              <select name="category" required defaultValue={editing?.category ?? category ?? ""} className={inputCls}>
                <option value="" disabled>
                  선택
                </option>
                {categories.map(({ name }) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="제목" required>
              <input name="title" required maxLength={300} defaultValue={editing?.title} className={inputCls} />
            </Field>
            {/* 인증서는 세로형이 많아 미리보기를 세로 비율로 보여줍니다. */}
            <ImageField currentUrl={editing && certificationImageUrl(editing.image_path)} previewCls="aspect-[3/4] w-40" />
            <Field label="내용">
              <textarea name="content" rows={4} maxLength={5000} defaultValue={editing?.content ?? ""} className={`${inputCls} resize-y`} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="작성일" required>
                <input name="written_date" type="date" required defaultValue={editing?.written_date ?? today} className={inputCls} />
              </Field>
              <Field label="작성자">
                <input name="author" maxLength={50} defaultValue={editing?.author ?? ""} className={inputCls} />
              </Field>
            </div>
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

      {/* 분류는 이곳 한 곳에서 관리 — 드롭다운·필터·사이트 탭이 모두 이 목록을 씁니다. */}
      <div className="mt-6">
        <Card title="분류 관리">
          <p className="mb-5 text-[13px] text-muted">
            이름을 바꾸면 그 분류의 기존 글도 함께 바뀌고, 사이트 탭은 순서 숫자가 작은 것부터 보입니다. 글이 남아 있는 분류는 삭제할 수 없습니다.
          </p>
          <ul className="divide-y divide-line border-y border-line">
            {categories.map((c) => {
              const count = usageCount(c.name);
              return (
                <li key={c.name} className="flex flex-wrap items-center gap-3 py-3">
                  <form action={saveCertificationCategory} className="flex flex-1 flex-wrap items-center gap-2">
                    <input type="hidden" name="original" value={c.name} />
                    <input name="name" required maxLength={30} defaultValue={c.name} aria-label="분류 이름" className={`${inputCls} max-w-[220px]`} />
                    <input name="sort_order" type="number" defaultValue={c.sort_order} aria-label="표시 순서" className={`${inputCls} w-20`} />
                    <span className="text-[13px] text-muted">글 {count}개</span>
                    <button type="submit" className={`${secondaryBtn} min-h-[38px] px-4`}>
                      저장
                    </button>
                  </form>
                  <form action={deleteCertificationCategory}>
                    <input type="hidden" name="name" value={c.name} />
                    <ConfirmButton message={`'${c.name}' 분류를 삭제할까요?`} className="text-[13px] text-red-600 hover:underline">
                      삭제
                    </ConfirmButton>
                  </form>
                </li>
              );
            })}
          </ul>
          <form action={saveCertificationCategory} className="mt-5 flex flex-wrap items-center gap-2">
            <input name="name" required maxLength={30} placeholder="새 분류 이름" aria-label="새 분류 이름" className={`${inputCls} max-w-[220px]`} />
            <input
              name="sort_order"
              type="number"
              defaultValue={(categories.at(-1)?.sort_order ?? 0) + 1}
              aria-label="표시 순서"
              className={`${inputCls} w-20`}
            />
            <button type="submit" className={`${primaryBtn} min-h-[38px] px-4`}>
              분류 추가
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
