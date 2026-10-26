import { cache } from "react";
import { supabase } from "@/lib/supabase";
import type { BoardCategory, BoardPost } from "./types";

/**
 * ESE 소식 게시판 Data (보도자료는 content/press.ts)
 *
 * 게시물은 Supabase `company_board_posts` 테이블에서 가져옵니다.
 * Supabase 대시보드(Table Editor)에서 행을 추가하면 상세 페이지는 최대 60초 뒤 반영됩니다.
 * 임의의 게시물을 만들지 마세요.
 */

export const BOARD_PAGE_SIZE = 10;

export const boardMeta: Record<BoardCategory, { path: string; label: string; emptyText: string }> = {
  news: { path: "/news", label: "ESE 소식", emptyText: "등록된 소식이 없습니다." },
};

type BoardRow = {
  id: string;
  category: BoardCategory;
  title: string;
  date: string;
  body: string[] | null;
  pinned: boolean;
  source_url: string | null;
  attachments: { name: string; href: string }[] | null;
};

const toPost = (row: BoardRow): BoardPost => ({
  id: row.id,
  category: row.category,
  title: row.title,
  date: row.date,
  body: row.body ?? [],
  pinned: row.pinned,
  sourceUrl: row.source_url ?? undefined,
  attachments: row.attachments?.length ? row.attachments : undefined,
});

/** 고정글 먼저, 이후 최신순 */
export const getBoardPosts = cache(async (category: BoardCategory): Promise<BoardPost[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("company_board_posts")
    .select("id, category, title, date, body, pinned, source_url, attachments")
    .eq("category", category)
    .order("pinned", { ascending: false })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error(`[board] ${category} 목록 조회 실패`, error.message);
    return [];
  }
  return (data as BoardRow[]).map(toPost);
});

export async function getBoardPost(category: BoardCategory, id: string) {
  const posts = await getBoardPosts(category);
  const index = posts.findIndex((p) => p.id === id);
  if (index < 0) return null;
  return { post: posts[index], newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
}
