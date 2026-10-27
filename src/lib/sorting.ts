import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { supabase } from "./supabase";

/**
 * 게시판 정렬 — 관리자 화면과 사이트가 같은 규칙을 씁니다.
 * 정렬 방식은 Supabase `company_board_settings`에 게시판별로 저장되고,
 * '직접 지정'일 때는 각 글의 `sort_order`(작을수록 앞) 순서를 따릅니다.
 * 공지사항의 상단 고정(pinned)은 호출하는 쪽에서 이 정렬보다 먼저 겁니다.
 */

export type SortBoard = "news" | "press" | "projects" | "certifications";
export type SortMode = "date_desc" | "date_asc" | "manual";

export const SORT_MODES: { value: SortMode; label: string }[] = [
  { value: "date_desc", label: "최신순" },
  { value: "date_asc", label: "오래된순" },
  { value: "manual", label: "직접 지정" },
];

/** 게시판별 테이블과 정렬 기준 날짜 칸 */
export const SORT_BOARDS: Record<SortBoard, { table: string; dateColumn: string }> = {
  news: { table: "company_board_posts", dateColumn: "date" },
  press: { table: "company_press", dateColumn: "written_date" },
  projects: { table: "company_projects", dateColumn: "written_date" },
  certifications: { table: "company_certifications", dateColumn: "written_date" },
};

export const isSortMode = (v: string): v is SortMode => SORT_MODES.some((m) => m.value === v);

export async function fetchSortMode(client: SupabaseClient | null, board: SortBoard): Promise<SortMode> {
  if (!client) return "date_desc";
  const { data } = await client.from("company_board_settings").select("sort_mode").eq("board", board).maybeSingle();
  return data && isSortMode(data.sort_mode) ? data.sort_mode : "date_desc";
}

/** 사이트용 — 한 요청 안에서는 한 번만 조회합니다. */
export const getSortMode = cache((board: SortBoard) => fetchSortMode(supabase, board));

type Orderable<T> = { order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }): T };

/** 정렬 방식에 맞춰 order를 붙입니다. 같은 값끼리는 등록 시각으로 순서를 고정합니다. */
export function applySort<T extends Orderable<T>>(query: T, board: SortBoard, mode: SortMode): T {
  if (mode === "manual") return query.order("sort_order").order("created_at", { ascending: false });
  const ascending = mode === "date_asc";
  return query.order(SORT_BOARDS[board].dateColumn, { ascending, nullsFirst: false }).order("created_at", { ascending });
}
