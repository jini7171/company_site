import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * 관리자 세션 (Server 전용)
 * 로그인하면 Supabase `company_admin_login`이 발급한 토큰을 httpOnly Cookie에 보관하고,
 * 관리자 요청마다 `x-admin-token` 헤더로 보냅니다. 실제 권한 검사는 DB의 RLS 정책(company_is_admin)이 합니다.
 */

export const ADMIN_COOKIE = "ese_admin";
export const ADMIN_SESSION_HOURS = 12;

export function adminClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY)가 없습니다.");
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "x-admin-token": token } },
  });
}

/** 유효한 관리자 세션이면 { db, token }, 아니면 null — 한 요청 안에서는 한 번만 확인합니다. */
export const getAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const db = adminClient(token);
  const { data } = await db.rpc("company_is_admin");
  return data === true ? { db, token } : null;
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");
  return admin;
}
