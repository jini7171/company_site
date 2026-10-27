"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CERTIFICATION_IMAGE_BUCKET } from "@/content/certifications";
import { PRESS_IMAGE_BUCKET } from "@/content/press";
import { PROJECT_IMAGE_BUCKET } from "@/content/projects";
import type { BoardCategory } from "@/content/types";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, requireAdmin } from "@/lib/admin";
import { boardAdmin, inquiryStatus, sortBoardAdminPath } from "@/lib/admin-config";
import { SORT_BOARDS, type SortBoard, applySort, isSortMode } from "@/lib/sorting";
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => text(form, key) || null;
const checked = (form: FormData, key: string) => form.get(key) === "on";

/** 처리 결과는 ?msg= 로 넘겨 목록 상단 배너에 표시합니다. */
const done = (path: string, msg: "saved" | "deleted" | "error" | "in_use" | "duplicate"): never =>
  redirect(`${path}${path.includes("?") ? "&" : "?"}msg=${msg}`);

/* ───────── 로그인 ───────── */

/** username: 실패 후 Form이 초기화돼도 아이디는 다시 채워 둡니다. */
export type LoginState = { error?: string; username?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const username = text(form, "username");
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "아이디와 비밀번호를 입력해 주세요.", username };
  if (!supabase) return { error: "Supabase 설정이 없습니다. .env.local을 확인해 주세요.", username };

  const { data: token, error } = await supabase.rpc("company_admin_login", { p_username: username, p_password: password });
  if (error) return { error: "로그인 중 문제가 발생했습니다.", username };
  if (!token) return { error: "아이디 또는 비밀번호가 올바르지 않습니다.", username };

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_SESSION_HOURS * 60 * 60,
  });
  redirect("/admin/dashboard");
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token && supabase) await supabase.rpc("company_admin_logout", { p_token: token });
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}

/* ───────── 공지사항(ESE 소식) ───────── */

export async function savePost(form: FormData) {
  const { db } = await requireAdmin();
  const category = text(form, "category") as BoardCategory;
  const path = boardAdmin[category]?.path;
  if (!path) return done("/admin/dashboard", "error");

  const id = text(form, "id");
  const values = {
    title: text(form, "title"),
    date: text(form, "date"),
    // 빈 줄로 문단을 나눕니다.
    body: text(form, "body")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    pinned: checked(form, "pinned"),
    published: checked(form, "published"),
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await db.from("company_board_posts").update(values).eq("id", id)
    : await db.from("company_board_posts").insert({
        ...values,
        id: `${values.date.replaceAll("-", "")}-${Date.now().toString(36).slice(-5)}`,
        category,
        sort_order: await topSortOrder(db, "company_board_posts"),
      });
  if (error) {
    console.error("[admin] 게시물 저장 실패", error.message);
    return done(path, "error");
  }

  revalidatePath(`/${category}`);
  revalidatePath(`/${category}/[id]`, "page");
  done(path, "saved");
}

export async function deletePost(form: FormData) {
  const { db } = await requireAdmin();
  const category = text(form, "category") as BoardCategory;
  const path = boardAdmin[category]?.path ?? "/admin/dashboard";
  const { error } = await db.from("company_board_posts").delete().eq("id", text(form, "id"));
  if (error) return done(path, "error");

  revalidatePath(`/${category}`);
  revalidatePath(`/${category}/[id]`, "page");
  done(path, "deleted");
}

/* ───────── 정렬 (공지사항 · 보도자료 · 사업실적 · 인증/특허) ───────── */

type AdminDb = Awaited<ReturnType<typeof requireAdmin>>["db"];

/** 새 글은 '직접 지정' 순서에서 맨 앞에 오도록 현재 가장 작은 순서보다 1 작게 줍니다. */
async function topSortOrder(db: AdminDb, table: string) {
  const { data } = await db.from(table).select("sort_order").order("sort_order").limit(1).maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 1) - 1;
}

function revalidateBoard(board: SortBoard) {
  if (board === "news") {
    revalidatePath("/news");
    revalidatePath("/news/[id]", "page");
  } else if (board === "press") revalidatePress();
  else if (board === "projects") revalidateProjects();
  else revalidatePath("/company/certifications");
  revalidatePath(sortBoardAdminPath[board]);
}

const asSortBoard = (v: string): SortBoard | null => (v in SORT_BOARDS ? (v as SortBoard) : null);

/** 게시판 정렬 방식 변경 (최신순 / 오래된순 / 직접 지정) */
export async function setSortMode(form: FormData) {
  const { db } = await requireAdmin();
  const board = asSortBoard(text(form, "board"));
  const mode = text(form, "mode");
  if (!board || !isSortMode(mode)) return done("/admin/dashboard", "error");

  const { error } = await db
    .from("company_board_settings")
    .update({ sort_mode: mode, updated_at: new Date().toISOString() })
    .eq("board", board);
  if (error) return done(sortBoardAdminPath[board], "error");

  revalidateBoard(board);
  done(sortBoardAdminPath[board], "saved");
}

/**
 * '직접 지정' 순서에서 글 하나를 위·아래·맨 위·맨 아래로 옮깁니다.
 * 공지사항은 상단 고정 글끼리, 일반 글끼리만 자리를 바꿉니다.
 */
export async function moveItem(form: FormData) {
  const { db } = await requireAdmin();
  const board = asSortBoard(text(form, "board"));
  const id = text(form, "id");
  const dir = text(form, "dir");
  if (!board || !["top", "up", "down", "bottom"].includes(dir)) return;

  const base = db.from(SORT_BOARDS[board].table).select(board === "news" ? "id, pinned" : "id");
  const query = board === "news" ? base.eq("category", "news").order("pinned", { ascending: false }) : base;
  const { data } = await applySort(query, board, "manual");
  const rows = ((data ?? []) as unknown as { id: string | number; pinned?: boolean }[]).map((r) => ({ id: String(r.id), group: !!r.pinned }));

  const current = rows.find((r) => r.id === id);
  if (!current) return;
  const group = rows.filter((r) => r.group === current.group).map((r) => r.id);
  const from = group.indexOf(id);
  const to = dir === "top" ? 0 : dir === "bottom" ? group.length - 1 : dir === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= group.length || to === from) return;
  group.splice(to, 0, ...group.splice(from, 1));

  // 같은 그룹 자리에 새 순서를 채워 전체 순서를 만듭니다.
  let next = 0;
  const ids = rows.map((r) => (r.group === current.group ? group[next++] : r.id));
  const { error } = await db.rpc("company_set_order", { p_board: board, p_ids: ids });
  if (error) {
    console.error("[admin] 순서 변경 실패", error.message);
    return done(sortBoardAdminPath[board], "error");
  }
  revalidateBoard(board);
}

/* ───────── 이미지 게시물 공통 (사업실적 · 인증/특허 · 보도자료) ───────── */

/**
 * Form의 `image` 파일을 Storage에 올리고 행을 저장합니다.
 * 새 글은 이미지 필수, 수정 시에는 새 파일을 고른 경우에만 교체하고 이전 파일을 지웁니다.
 */
async function saveWithImage(
  db: AdminDb,
  { table, bucket, form, values }: { table: string; bucket: string; form: FormData; values: Record<string, unknown> },
) {
  const id = Number(text(form, "id")) || null;
  const image = form.get("image");
  const file = image instanceof File && image.size > 0 ? image : null;
  if (!id && !file) return false;
  if (file && (!IMAGE_TYPES.includes(file.type) || file.size > IMAGE_MAX_BYTES)) return false;

  const storage = db.storage.from(bucket);
  let newPath: string | null = null;
  if (file) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    newPath = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
    const { error } = await storage.upload(newPath, file, { contentType: file.type });
    if (error) {
      console.error(`[admin] ${bucket} 이미지 업로드 실패`, error.message);
      return false;
    }
  }

  const oldPath = id ? ((await db.from(table).select("image_path").eq("id", id).maybeSingle()).data?.image_path as string | undefined) : undefined;
  const row = { ...values, updated_at: new Date().toISOString(), ...(newPath && { image_path: newPath }) };
  const { error } = id
    ? await db.from(table).update(row).eq("id", id)
    : await db.from(table).insert({ ...row, sort_order: await topSortOrder(db, table) });
  if (error) {
    console.error(`[admin] ${table} 저장 실패`, error.message);
    if (newPath) await storage.remove([newPath]);
    return false;
  }
  if (newPath && oldPath) await storage.remove([oldPath]);
  return true;
}

/** 행과 Storage 이미지를 함께 삭제합니다. */
async function deleteWithImage(db: AdminDb, { table, bucket, form }: { table: string; bucket: string; form: FormData }) {
  const id = Number(text(form, "id"));
  const { data } = await db.from(table).select("image_path").eq("id", id).maybeSingle();
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return false;
  if (data?.image_path) await db.storage.from(bucket).remove([data.image_path]);
  return true;
}

/* ───────── 사업실적 ───────── */

function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/business/performance");
  revalidatePath("/business/[slug]", "page");
}

export async function saveProject(form: FormData) {
  const { db } = await requireAdmin();
  const ok = await saveWithImage(db, {
    table: "company_projects",
    bucket: PROJECT_IMAGE_BUCKET,
    form,
    values: {
      category: text(form, "category"),
      title: text(form, "title"),
      content: optional(form, "content"),
      start_date: optional(form, "start_date"),
      end_date: optional(form, "end_date"),
      written_date: optional(form, "written_date"),
      published: checked(form, "published"),
    },
  });
  if (!ok) return done("/admin/projects", "error");

  revalidateProjects();
  done("/admin/projects", "saved");
}

export async function deleteProject(form: FormData) {
  const { db } = await requireAdmin();
  if (!(await deleteWithImage(db, { table: "company_projects", bucket: PROJECT_IMAGE_BUCKET, form }))) {
    return done("/admin/projects", "error");
  }

  revalidateProjects();
  done("/admin/projects", "deleted");
}

/* ───────── 인증/특허 ───────── */

export async function saveCertification(form: FormData) {
  const { db } = await requireAdmin();
  const ok = await saveWithImage(db, {
    table: "company_certifications",
    bucket: CERTIFICATION_IMAGE_BUCKET,
    form,
    values: {
      category: text(form, "category"),
      title: text(form, "title"),
      content: optional(form, "content"),
      // 작성일은 필수 — 비워두면 오늘 날짜로 저장합니다.
      written_date: text(form, "written_date") || new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }),
      author: optional(form, "author"),
      published: checked(form, "published"),
    },
  });
  if (!ok) return done("/admin/certifications", "error");

  revalidatePath("/company/certifications");
  done("/admin/certifications", "saved");
}

export async function deleteCertification(form: FormData) {
  const { db } = await requireAdmin();
  if (!(await deleteWithImage(db, { table: "company_certifications", bucket: CERTIFICATION_IMAGE_BUCKET, form }))) {
    return done("/admin/certifications", "error");
  }

  revalidatePath("/company/certifications");
  done("/admin/certifications", "deleted");
}

/** 분류 추가(original 없음) 또는 이름·순서 변경 — 이름을 바꾸면 기존 글의 분류도 DB에서 함께 바뀝니다. */
export async function saveCertificationCategory(form: FormData) {
  const { db } = await requireAdmin();
  const original = text(form, "original");
  const values = { name: text(form, "name"), sort_order: Number(text(form, "sort_order")) || 0 };
  if (!values.name) return done("/admin/certifications", "error");

  const { error } = original
    ? await db.from("company_certification_categories").update(values).eq("name", original)
    : await db.from("company_certification_categories").insert(values);
  if (error) {
    console.error("[admin] 분류 저장 실패", error.message);
    return done("/admin/certifications", error.code === "23505" ? "duplicate" : "error");
  }

  revalidatePath("/company/certifications");
  done("/admin/certifications", "saved");
}

/** 분류 삭제 — 그 분류를 쓰는 글이 있으면 DB가 막습니다. */
export async function deleteCertificationCategory(form: FormData) {
  const { db } = await requireAdmin();
  const { error } = await db.from("company_certification_categories").delete().eq("name", text(form, "name"));
  if (error) return done("/admin/certifications", error.code === "23503" ? "in_use" : "error");

  revalidatePath("/company/certifications");
  done("/admin/certifications", "deleted");
}

/* ───────── 보도자료 ───────── */

function revalidatePress() {
  revalidatePath("/press");
  revalidatePath("/press/[id]", "page");
}

export async function savePress(form: FormData) {
  const { db } = await requireAdmin();
  const sourceUrl = text(form, "source_url");
  if (!/^https?:\/\//i.test(sourceUrl)) return done("/admin/press", "error");

  const ok = await saveWithImage(db, {
    table: "company_press",
    bucket: PRESS_IMAGE_BUCKET,
    form,
    values: {
      title: text(form, "title"),
      source_url: sourceUrl,
      content: text(form, "content"),
      // 작성일은 필수 — 비워두면 오늘 날짜로 저장합니다.
      written_date: text(form, "written_date") || new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }),
      author: optional(form, "author"),
      published: checked(form, "published"),
    },
  });
  if (!ok) return done("/admin/press", "error");

  revalidatePress();
  done("/admin/press", "saved");
}

export async function deletePress(form: FormData) {
  const { db } = await requireAdmin();
  if (!(await deleteWithImage(db, { table: "company_press", bucket: PRESS_IMAGE_BUCKET, form }))) {
    return done("/admin/press", "error");
  }

  revalidatePress();
  done("/admin/press", "deleted");
}

/* ───────── 문의사항 ───────── */

export async function updateInquiry(form: FormData) {
  const { db } = await requireAdmin();
  const status = text(form, "status");
  if (!(status in inquiryStatus)) return done("/admin/inquiries", "error");
  // 같은 필터 화면으로 돌아가되, 관리자 화면 밖으로는 보내지 않습니다.
  const back = text(form, "back").startsWith("/admin/inquiries") ? text(form, "back") : "/admin/inquiries";
  const { error } = await db
    .from("company_inquiries")
    .update({
      status,
      admin_memo: optional(form, "admin_memo"),
      answered_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", Number(text(form, "id")));
  if (error) {
    console.error("[admin] 문의 수정 실패", error.message);
    return done(back, "error");
  }
  done(back, "saved");
}

export async function deleteInquiry(form: FormData) {
  const { db } = await requireAdmin();
  const { error } = await db.from("company_inquiries").delete().eq("id", Number(text(form, "id")));
  done("/admin/inquiries", error ? "error" : "deleted");
}
