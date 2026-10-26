import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Supabase Client (Publishable Key)
 * 게시판 읽기·문의 접수는 RLS 정책으로 허용된 범위에서만 동작합니다.
 * 환경변수가 없으면 null — 게시판은 빈 목록, 문의는 기존 Webhook/개발 모드로 처리합니다.
 */
export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
