import { ArrowUpRight, ChevronDown, ChevronUp, Download, List } from "lucide-react";
import Link from "next/link";
import type { BoardPost } from "@/content/types";

type BoardDetailProps = {
  post: BoardPost;
  label: string;
  basePath: string;
  newer: BoardPost | null;
  older: BoardPost | null;
};

/** 게시물 상세 — 제목·등록일 / 본문 / 첨부 / 이전·다음 글 / 목록 */
export function BoardDetail({ post, label, basePath, newer, older }: BoardDetailProps) {
  return (
    <article className="py-16 md:py-24">
      <div className="container max-w-[960px]">
        <header className="border-b border-line border-t-2 border-t-ink pb-8 pt-10">
          <p className="eyebrow">{label}</p>
          <h1 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.35] tracking-[-0.03em]">{post.title}</h1>
          <time dateTime={post.date} className="mt-5 block font-en text-[14px] tabular-nums text-muted">
            {post.date.replaceAll("-", ".")}
          </time>
        </header>

        <div className="space-y-5 py-12 text-[17px] leading-[1.9] text-ink/85">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-brand"
            >
              기사 원문 보기
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <ul className="border-t border-line bg-subtle px-6 py-4">
            {post.attachments.map((file) => (
              <li key={file.href}>
                <a href={file.href} download className="inline-flex min-h-[44px] items-center gap-2 text-[15px] hover:text-brand">
                  <Download aria-hidden="true" className="h-4 w-4" />
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        <nav aria-label="이전·다음 게시물" className="border-y border-line">
          <AdjacentRow icon="up" label="다음 글" post={newer} basePath={basePath} />
          <AdjacentRow icon="down" label="이전 글" post={older} basePath={basePath} />
        </nav>

        <div className="mt-10 flex justify-center">
          <Link
            href={basePath}
            className="inline-flex min-h-[52px] items-center gap-2 border border-ink/15 px-8 text-[15px] font-semibold transition-colors hover:border-ink"
          >
            <List aria-hidden="true" className="h-4 w-4" />
            목록
          </Link>
        </div>
      </div>
    </article>
  );
}

function AdjacentRow({ icon, label, post, basePath }: { icon: "up" | "down"; label: string; post: BoardPost | null; basePath: string }) {
  const Icon = icon === "up" ? ChevronUp : ChevronDown;
  const inner = (
    <>
      <span className="flex w-24 shrink-0 items-center gap-2 text-[14px] font-semibold text-ink/70">
        <Icon aria-hidden="true" className="h-4 w-4" />
        {label}
      </span>
      <span className={`line-clamp-1 text-[15px] ${post ? "" : "text-muted"}`}>{post ? post.title : `${label}이 없습니다.`}</span>
    </>
  );
  return post ? (
    <Link href={`${basePath}/${post.id}`} className="flex min-h-[60px] items-center gap-4 border-b border-line px-2 last:border-b-0 hover:bg-subtle hover:text-brand">
      {inner}
    </Link>
  ) : (
    <div className="flex min-h-[60px] items-center gap-4 border-b border-line px-2 last:border-b-0">{inner}</div>
  );
}
