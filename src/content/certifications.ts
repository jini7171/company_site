import { cache } from "react";
import { applySort, getSortMode } from "@/lib/sorting";
import { publicImageUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type { Certification } from "./types";

/**
 * 인증/특허 Data
 *
 * 관리자 페이지(/admin/certifications)에서 등록하며 Supabase `company_certifications` 테이블에,
 * 이미지는 Storage `company-certifications` 버킷에 저장됩니다. 임의의 인증을 만들지 마세요.
 */

export const CERTIFICATION_IMAGE_BUCKET = "company-certifications";

export const certificationImageUrl = (path: string) => publicImageUrl(CERTIFICATION_IMAGE_BUCKET, path);

/**
 * 분류 목록 — Supabase `company_certification_categories` 한 곳에서 관리합니다.
 * 관리자 페이지의 '분류 관리'에서 추가·이름 변경·순서 조정을 하면 드롭다운과 사이트 탭에 함께 반영됩니다.
 */
export const getCertificationCategories = cache(async (): Promise<string[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("company_certification_categories")
    .select("name")
    .order("sort_order")
    .order("name");
  if (error) {
    console.error("[certifications] 분류 조회 실패", error.message);
    return [];
  }
  return data.map((row) => row.name as string);
});

type CertificationRow = {
  id: number;
  category: string;
  title: string;
  content: string | null;
  image_path: string;
  written_date: string;
};

/** 관리자가 고른 정렬 방식(최신순·오래된순·직접 지정) */
export const getCertifications = cache(async (): Promise<Certification[]> => {
  if (!supabase) return [];
  const mode = await getSortMode("certifications");
  const { data, error } = await applySort(
    supabase.from("company_certifications").select("id, category, title, content, image_path, written_date"),
    "certifications",
    mode,
  );
  if (error) {
    console.error("[certifications] 목록 조회 실패", error.message);
    return [];
  }
  return (data as CertificationRow[]).map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content ?? undefined,
    imageUrl: certificationImageUrl(row.image_path),
    writtenDate: row.written_date,
  }));
});
