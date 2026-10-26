import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * 방문 기록 (관리자 대시보드 통계용)
 * IP와 전체 User-Agent는 저장하지 않고 기기 종류·브라우저 이름만 남깁니다.
 * 방문자 구분은 1년짜리 익명 쿠키(ese_vid)로 합니다.
 */

const VISITOR_COOKIE = "ese_vid";
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function deviceOf(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

function browserOf(ua: string) {
  if (/whale/i.test(ua)) return "Whale";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/naver/i.test(ua)) return "NAVER App";
  if (/kakaotalk/i.test(ua)) return "KakaoTalk";
  if (/edg\//i.test(ua)) return "Edge";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "기타";
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!supabase || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

  let body: { path?: string; referrer?: string; entry?: boolean };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const path = String(body.path ?? "").slice(0, 300);
  if (!path.startsWith("/") || path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  // 같은 사이트 안에서 이동한 경우는 유입 경로로 보지 않습니다.
  let referrerHost: string | null = null;
  try {
    const host = body.referrer ? new URL(body.referrer).hostname : "";
    if (host && host !== new URL(request.url).hostname) referrerHost = host.replace(/^www\./, "").slice(0, 200);
  } catch {
    referrerHost = null;
  }

  const cookie = request.headers.get("cookie")?.match(new RegExp(`${VISITOR_COOKIE}=([^;]+)`))?.[1];
  const visitorId = cookie && UUID_RE.test(cookie) ? cookie : crypto.randomUUID();

  const { error } = await supabase.from("company_page_views").insert({
    visitor_id: visitorId,
    path,
    is_entry: !!body.entry,
    referrer_host: body.entry ? referrerHost : null,
    device: deviceOf(ua),
    browser: browserOf(ua),
  });
  if (error) console.error("[track] 방문 기록 실패", error.message);

  const res = new NextResponse(null, { status: 204 });
  if (visitorId !== cookie) {
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}
