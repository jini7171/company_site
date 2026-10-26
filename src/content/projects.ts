import { cache } from "react";
import { publicImageUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type { BusinessPerformance, Project } from "./types";

/**
 * 사업실적 Data
 *
 * 프로젝트는 관리자 페이지(/admin/projects)에서 등록하며 Supabase `company_projects` 테이블에,
 * 이미지는 Storage `company-projects` 버킷에 저장됩니다. 임의의 실적을 만들지 마세요.
 */

export const PROJECT_IMAGE_BUCKET = "company-projects";

/** 프로젝트 분류 — DB check 제약과 같은 값. businessSlug가 있으면 사업분야 페이지와 연결됩니다. */
export const projectCategories = [
  { label: "스마트시티", businessSlug: "smart-city" },
  { label: "재난안전", businessSlug: "disaster-safety" },
  { label: "통합관제센터" },
  { label: "해외스마트시티", businessSlug: "global-smart-city" },
  { label: "국토공간정보", businessSlug: "geospatial" },
  { label: "도로교통", businessSlug: "road-transportation" },
] as const satisfies readonly { label: string; businessSlug?: string }[];

export type ProjectCategory = (typeof projectCategories)[number]["label"];

export const projectImageUrl = (path: string) => publicImageUrl(PROJECT_IMAGE_BUCKET, path);

type ProjectRow = {
  id: number;
  category: ProjectCategory;
  title: string;
  content: string | null;
  image_path: string;
  start_date: string | null;
  end_date: string | null;
  written_date: string | null;
};

/** 작성일 최신순 */
export const getProjects = cache(async (): Promise<Project[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("company_projects")
    .select("id, category, title, content, image_path, start_date, end_date, written_date")
    .order("written_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[projects] 목록 조회 실패", error.message);
    return [];
  }
  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content ?? undefined,
    imageUrl: projectImageUrl(row.image_path),
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    writtenDate: row.written_date ?? undefined,
  }));
});

/** 사업 분야별 공개 프로젝트 수(없으면 null → "집계 중")와 최근 프로젝트명 */
export async function getBusinessPerformance(): Promise<BusinessPerformance[]> {
  const projects = await getProjects();
  return projectCategories.flatMap((c) => {
    if (!("businessSlug" in c)) return [];
    const items = projects.filter((p) => p.category === c.label);
    return [{ businessSlug: c.businessSlug, projectCount: items.length || null, latestTitle: items[0]?.title }];
  });
}
