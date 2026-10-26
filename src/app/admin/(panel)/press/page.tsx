import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { deletePress, savePress } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, Check, Field, ImageField, PageHeader, ResultBanner, inputCls, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { pressImageUrl } from "@/content/press";
import { requireAdmin } from "@/lib/admin";

type PressRow = {
  id: number;
  title: string;
  source_url: string;
  image_path: string;
  content: string;
  written_date: string;
  author: string | null;
  published: boolean;
};

type Props = { searchParams: Promise<{ edit?: string; msg?: string }> };

const COLUMNS = "id, title, source_url, image_path, content, written_date, author, published";

/** 보도자료 관리 — 왼쪽 갤러리(이미지·제목·작성일), 오른쪽 작성/수정 Form */
export default async function AdminPressPage({ searchParams }: Props) {
  const { edit, msg } = await searchParams;
  const { db } = await requireAdmin();

  const { data } = await db.from("company_press").select(COLUMNS).order("written_date", { ascending: false }).order("created_at", { ascending: false });
  const items = (data ?? []) as PressRow[];
  const editId = Number(edit) || null;
  const editing = editId ? items.find((p) => p.id === editId) : undefined;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  return (
    <>
      <PageHeader
        title="보도자료"
        description="공개된 기사가 사이트의 Support > 보도자료 페이지에 갤러리로 표시됩니다."
        action={
          <Link href="/press" target="_blank" className={secondaryBtn}>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            사이트에서 보기
          </Link>
        }
      />
      <ResultBanner msg={msg} />

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <Card title={`목록 (${items.length})`}>
          {items.length ? (
            <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 2xl:grid-cols-3">
              {items.map((p) => (
                <li key={p.id} className={`border p-2 ${p.id === editId ? "border-brand bg-brand-50" : "border-transparent"}`}>
                  <Link href={`?edit=${p.id}`} className="group block">
                    {/* eslint-disable-next-line @next/next/no-img-element -- 관리자 갤러리 썸네일 */}
                    <img
                      src={pressImageUrl(p.image_path)}
                      alt=""
                      className="aspect-[16/10] w-full border border-line bg-subtle object-cover transition-opacity group-hover:opacity-90"
                    />
                    <p className="mt-3 line-clamp-2 text-[15px] font-semibold leading-[1.45] group-hover:text-brand">{p.title}</p>
                  </Link>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[13px] text-muted">
                      {p.written_date}
                      {p.published ? <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">공개</Badge> : <Badge>비공개</Badge>}
                    </span>
                    <form action={deletePress}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton
                        message={`'${p.title}' 보도자료를 삭제할까요? 이미지도 함께 삭제되며 되돌릴 수 없습니다.`}
                        className="text-[13px] text-red-600 hover:underline"
                      >
                        삭제
                      </ConfirmButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-12 text-center text-[14px] text-muted">등록된 보도자료가 없습니다.</p>
          )}
        </Card>

        <Card
          title={editing ? "보도자료 수정" : "새 보도자료 등록"}
          action={editing && <Link href="?" className="text-[13px] font-semibold text-brand hover:underline">새로 등록</Link>}
        >
          <form key={editing?.id ?? "new"} action={savePress} className="space-y-5">
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <Field label="제목" required>
              <input name="title" required maxLength={300} defaultValue={editing?.title} className={inputCls} />
            </Field>
            <Field label="출처" required hint="기사 원문 주소 (http:// 또는 https://로 시작)">
              <input name="source_url" type="url" required maxLength={1000} placeholder="https://" defaultValue={editing?.source_url} className={inputCls} />
            </Field>
            <ImageField currentUrl={editing && pressImageUrl(editing.image_path)} />
            <Field label="내용" required>
              <textarea name="content" required rows={8} maxLength={10000} defaultValue={editing?.content} className={`${inputCls} resize-y`} />
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
    </>
  );
}
