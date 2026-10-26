import { ExternalLink, Pin } from "lucide-react";
import Link from "next/link";
import { deletePost, savePost } from "@/app/admin/actions";
import type { BoardCategory } from "@/content/types";
import { requireAdmin } from "@/lib/admin";
import { boardAdmin } from "@/lib/admin-config";
import { ConfirmButton } from "./ConfirmButton";
import { Badge, Card, Check, EmptyRow, Field, PageHeader, ResultBanner, inputCls, primaryBtn, secondaryBtn, td, th } from "./ui";

type PostRow = {
  id: string;
  title: string;
  date: string;
  body: string[];
  pinned: boolean;
  published: boolean;
};

export type ManagerSearchParams = Promise<{ edit?: string; msg?: string }>;

/** 공지사항(news) 관리 — 왼쪽 목록, 오른쪽 작성/수정 Form (보도자료는 /admin/press 갤러리) */
export async function PostManager({ category, searchParams }: { category: BoardCategory; searchParams: ManagerSearchParams }) {
  const { edit, msg } = await searchParams;
  const { db } = await requireAdmin();
  const meta = boardAdmin[category];

  const { data } = await db
    .from("company_board_posts")
    .select("id, title, date, body, pinned, published")
    .eq("category", category)
    .order("pinned", { ascending: false })
    .order("date", { ascending: false });
  const posts = (data ?? []) as PostRow[];
  const editing = edit ? posts.find((p) => p.id === edit) : undefined;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  return (
    <>
      <PageHeader
        title={meta.label}
        description={`사이트의 '${meta.publicLabel}' 게시판에 표시됩니다. 비공개 글은 사이트에 보이지 않습니다.`}
        action={
          <Link href={`/${category}`} target="_blank" className={secondaryBtn}>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            사이트에서 보기
          </Link>
        }
      />
      <ResultBanner msg={msg} />

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <Card title={`목록 (${posts.length})`}>
          <div className="-m-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>제목</th>
                  <th className={th}>게시일</th>
                  <th className={th}>상태</th>
                  <th className={th}>
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.length ? (
                  posts.map((p) => (
                    <tr key={p.id} className={p.id === edit ? "bg-brand-50" : undefined}>
                      <td className={td}>
                        <Link href={`?edit=${p.id}`} className="font-medium hover:text-brand">
                          {p.pinned && <Pin aria-label="상단 고정" className="mr-1 inline h-3.5 w-3.5 text-brand" />}
                          {p.title}
                        </Link>
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted`}>{p.date}</td>
                      <td className={td}>
                        {p.published ? <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">공개</Badge> : <Badge>비공개</Badge>}
                      </td>
                      <td className={`${td} whitespace-nowrap text-right`}>
                        <form action={deletePost} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="category" value={category} />
                          <ConfirmButton message={`'${p.title}' 글을 삭제할까요? 되돌릴 수 없습니다.`} className="text-[13px] text-red-600 hover:underline">
                            삭제
                          </ConfirmButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={4}>등록된 글이 없습니다. '새 글 작성'에서 첫 글을 등록해 보세요.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={editing ? "글 수정" : "새 글 작성"}
          action={editing && <Link href="?" className="text-[13px] font-semibold text-brand hover:underline">새 글 작성</Link>}
        >
          {/* key: 다른 글을 선택하면 Form 기본값을 새로 채웁니다. */}
          <form key={editing?.id ?? "new"} action={savePost} className="space-y-5">
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <Field label="제목" required>
              <input name="title" required maxLength={300} defaultValue={editing?.title} className={inputCls} />
            </Field>
            <Field label="게시일" required>
              <input name="date" type="date" required defaultValue={editing?.date ?? today} className={inputCls} />
            </Field>
            <Field label="본문" hint="빈 줄(Enter 두 번)로 문단을 나눕니다.">
              <textarea name="body" rows={10} defaultValue={editing?.body.join("\n\n")} className={`${inputCls} resize-y`} />
            </Field>
            <div className="flex flex-wrap gap-x-6">
              <Check name="published" label="사이트에 공개" defaultChecked={editing?.published ?? true} />
              <Check name="pinned" label="목록 상단 고정" defaultChecked={editing?.pinned} />
            </div>
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
