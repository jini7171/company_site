import { ChevronLeft, ChevronRight, Inbox, Paperclip, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BOARD_PAGE_SIZE } from "@/content/board";
import type { BoardPost } from "@/content/types";

type BoardListProps = {
  posts: BoardPost[];
  basePath: string;
  emptyText: string;
  page: number;
  query: string;
};

const formatDate = (date: string) => date.replaceAll("-", ".");

/** 게시판 목록 — 검색(?q=)과 페이지(?page=)는 URL Query로 처리해 Server에서 렌더링합니다. */
export function BoardList({ posts, basePath, emptyText, page, query }: BoardListProps) {
  const keyword = query.trim();
  const filtered = keyword ? posts.filter((p) => p.title.includes(keyword) || p.body.some((b) => b.includes(keyword))) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / BOARD_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const rows = filtered.slice((current - 1) * BOARD_PAGE_SIZE, current * BOARD_PAGE_SIZE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-[15px] text-muted">
          전체 <strong className="font-en font-semibold text-ink">{filtered.length}</strong>건
          {keyword && <span className="ml-2">· &lsquo;{keyword}&rsquo; 검색 결과</span>}
        </p>
        <form action={basePath} method="get" role="search" className="flex w-full border border-line bg-white md:w-[360px]">
          <label htmlFor="board-search" className="sr-only">
            게시물 검색
          </label>
          <input
            id="board-search"
            name="q"
            defaultValue={keyword}
            placeholder="제목 또는 내용 검색"
            className="min-h-[48px] flex-1 bg-transparent px-4 text-[15px] placeholder:text-muted/70 focus:outline-none"
          />
          <button type="submit" aria-label="검색" className="flex w-12 items-center justify-center text-ink hover:text-brand">
            <Search aria-hidden="true" className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="mt-6 border-t-2 border-ink">
        <div className="hidden grid-cols-[6rem_1fr_9rem] border-b border-line py-4 text-center text-[14px] font-semibold text-ink/70 md:grid">
          <span>번호</span>
          <span>제목</span>
          <span>등록일</span>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 border-b border-line py-24 text-center">
            <Inbox aria-hidden="true" className="h-8 w-8 text-ink/25" strokeWidth={1.5} />
            <p className="text-[16px] text-muted">{keyword ? "검색 결과가 없습니다." : emptyText}</p>
          </div>
        ) : (
          <ul>
            {rows.map((post, i) => {
              const number = filtered.length - ((current - 1) * BOARD_PAGE_SIZE + i);
              return (
                <li key={post.id} className="border-b border-line">
                  <Link
                    href={`${basePath}/${post.id}`}
                    className={`group grid gap-2 px-1 py-5 transition-colors hover:bg-subtle md:grid-cols-[6rem_1fr_9rem] md:items-center md:gap-0 md:py-6 ${
                      post.pinned ? "bg-brand-50/40" : ""
                    }`}
                  >
                    <span className="hidden text-center md:block">
                      {post.pinned ? (
                        <span className="inline-block bg-brand px-2.5 py-1 text-[12px] font-semibold text-white">공지</span>
                      ) : (
                        <span className="font-en text-[14px] tabular-nums text-muted">{number}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 text-[17px] font-medium tracking-[-0.01em] group-hover:text-brand md:px-4">
                      {post.pinned && <span className="bg-brand px-2 py-0.5 text-[12px] font-semibold text-white md:hidden">공지</span>}
                      <span className="line-clamp-1">{post.title}</span>
                      {post.attachments && post.attachments.length > 0 && (
                        <Paperclip aria-label="첨부파일 있음" className="h-4 w-4 shrink-0 text-muted" />
                      )}
                    </span>
                    <time dateTime={post.date} className="font-en text-[14px] tabular-nums text-muted md:text-center">
                      {formatDate(post.date)}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="페이지 이동" className="mt-10 flex items-center justify-center gap-1">
          <PageLink href={pageHref(current - 1)} disabled={current === 1} label="이전 페이지">
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </PageLink>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === current ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center font-en text-[15px] transition-colors ${
                p === current ? "bg-ink font-semibold text-white" : "text-muted hover:bg-subtle hover:text-ink"
              }`}
            >
              {p}
            </Link>
          ))}
          <PageLink href={pageHref(current + 1)} disabled={current === totalPages} label="다음 페이지">
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: ReactNode }) {
  if (disabled) {
    return (
      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center text-ink/20">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className="flex h-11 w-11 items-center justify-center text-ink hover:bg-subtle">
      {children}
    </Link>
  );
}
