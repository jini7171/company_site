import { notFound } from "next/navigation";
import { boardMeta, getBoardPost, getBoardPosts } from "@/content/board";
import type { BoardCategory } from "@/content/types";
import { BoardDetail } from "./BoardDetail";
import { BoardList } from "./BoardList";
import { SubNav } from "./SubNav";
import { SubpageHero } from "./SubpageHero";

/**
 * ESE 소식·보도자료가 같은 게시판 구조를 쓰도록 목록/상세 화면을 한 곳에서 만듭니다.
 * 각 route의 page.tsx는 category만 넘깁니다.
 */

export type BoardSearchParams = Promise<{ page?: string; q?: string }>;

const HERO: Record<BoardCategory, { eyebrow: string; description: string }> = {
  news: { eyebrow: "NEWS", description: "ESE의 사업과 기술, 사람들의 이야기를 전합니다." },
  press: { eyebrow: "PRESS", description: "언론에 소개된 ESE의 사업과 기술 소식입니다." },
};

export async function BoardListPage({ category, searchParams }: { category: BoardCategory; searchParams: BoardSearchParams }) {
  const { page, q } = await searchParams;
  const meta = boardMeta[category];

  return (
    <>
      <SubpageHero href={meta.path} eyebrow={HERO[category].eyebrow} title={meta.label} description={HERO[category].description} />
      <SubNav href={meta.path} />
      <section className="py-16 md:py-24">
        <div className="container max-w-content">
          <BoardList
            posts={getBoardPosts(category)}
            basePath={meta.path}
            emptyText={meta.emptyText}
            page={Number(page) || 1}
            query={q ?? ""}
          />
        </div>
      </section>
    </>
  );
}

export function boardStaticParams(category: BoardCategory) {
  return getBoardPosts(category).map((p) => ({ id: p.id }));
}

export async function BoardDetailPage({ category, params }: { category: BoardCategory; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = getBoardPost(category, id);
  if (!found) notFound();
  const meta = boardMeta[category];

  return (
    <>
      <SubNav href={meta.path} />
      <BoardDetail post={found.post} label={meta.label} basePath={meta.path} newer={found.newer} older={found.older} />
    </>
  );
}
