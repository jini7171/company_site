import type { BoardCategory } from "@/content/types";
import type { SortBoard } from "./sorting";

/** 관리자 화면 공통 설정 — Server Action과 화면에서 함께 사용합니다. */

export const boardAdmin: Record<BoardCategory, { path: string; label: string; publicLabel: string }> = {
  news: { path: "/admin/notices", label: "공지사항", publicLabel: "ESE 소식" },
};

/** 정렬 설정이 있는 게시판의 관리자 화면 경로 */
export const sortBoardAdminPath: Record<SortBoard, string> = {
  news: "/admin/notices",
  press: "/admin/press",
  projects: "/admin/projects",
  certifications: "/admin/certifications",
};

export const inquiryStatus = {
  new: { label: "미확인", tone: "bg-red-50 text-red-700 border-red-200" },
  in_progress: { label: "처리 중", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  done: { label: "답변 완료", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
} as const;

export type InquiryStatus = keyof typeof inquiryStatus;
