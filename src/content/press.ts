import { cache } from "react";
import { publicImageUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type { PressRelease } from "./types";

/**
 * 보도자료 Data
 *
 * 관리자 페이지(/admin/press)에서 등록하며 Supabase `company_press` 테이블에,
 * 이미지는 Storage `company-press` 버킷에 저장됩니다. 임의의 기사를 만들지 마세요.
 */

export const PRESS_IMAGE_BUCKET = "company-press";
export const PRESS_PAGE_SIZE = 12;

export const pressImageUrl = (path: string) => publicImageUrl(PRESS_IMAGE_BUCKET, path);

type PressRow = {
  id: number;
  title: string;
  source_url: string;
  image_path: string;
  content: string;
  written_date: string;
};

/** 작성일 최신순 */
export const getPressReleases = cache(async (): Promise<PressRelease[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("company_press")
    .select("id, title, source_url, image_path, content, written_date")
    .order("written_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[press] 목록 조회 실패", error.message);
    return [];
  }
  return (data as PressRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    sourceUrl: row.source_url,
    imageUrl: pressImageUrl(row.image_path),
    content: row.content,
    writtenDate: row.written_date,
  }));
});

/** 상세 + 이전(더 오래된)·다음(더 최근) 기사 */
export async function getPressRelease(id: number) {
  const items = await getPressReleases();
  const index = items.findIndex((p) => p.id === id);
  if (index < 0) return null;
  return { item: items[index], newer: items[index - 1] ?? null, older: items[index + 1] ?? null };
}
