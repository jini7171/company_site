import type { BoardCategory, BoardPost } from "./types";

/**
 * ESE 소식 / 보도자료 게시판 Data
 *
 * TODO: CMS 연동 전까지 이 배열에 실제 게시물을 추가하세요. 임의의 게시물을 만들지 마세요.
 * 예시)
 * {
 *   id: "2026-001",
 *   category: "news",
 *   title: "게시물 제목",
 *   date: "2026-10-25",
 *   body: ["첫 번째 문단", "두 번째 문단"],
 *   pinned: false,
 * }
 */
export const boardPosts: BoardPost[] = [];

export const BOARD_PAGE_SIZE = 10;

export const boardMeta: Record<BoardCategory, { path: string; label: string; emptyText: string }> = {
  news: { path: "/news", label: "ESE 소식", emptyText: "등록된 소식이 없습니다." },
  press: { path: "/press", label: "보도자료", emptyText: "등록된 보도자료가 없습니다." },
};

/** 고정글 먼저, 이후 최신순 */
export function getBoardPosts(category: BoardCategory) {
  return boardPosts
    .filter((p) => p.category === category)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));
}

export function getBoardPost(category: BoardCategory, id: string) {
  const posts = getBoardPosts(category);
  const index = posts.findIndex((p) => p.id === id);
  if (index < 0) return null;
  return { post: posts[index], newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
}
