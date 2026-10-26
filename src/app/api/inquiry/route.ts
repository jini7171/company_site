import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type InquiryPayload = {
  name: string;
  /** 소속 (기관·회사 / 부서) */
  affiliation: string;
  /** 직급 */
  position?: string;
  phone?: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  agree: boolean;
  /** Honeypot — 사람이 입력하지 않는 숨김 필드 */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 사업 문의 접수
 * Supabase `company_inquiries` 테이블에 저장하고, INQUIRY_WEBHOOK_URL이 있으면 알림용으로도 전달합니다.
 * 저장소·전달 경로가 모두 없는 Production 환경에서는 접수하지 않고 503을 반환해, 문의가 유실되지 않도록 합니다.
 */
export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "잘못된 요청입니다." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const required = [body.name, body.affiliation, body.type, body.subject, body.message];
  const missing = required.some((v) => !v?.trim());
  if (missing || !EMAIL_RE.test(body.email ?? "") || !body.agree) {
    return NextResponse.json({ ok: false, message: "필수 항목을 확인해 주세요." }, { status: 422 });
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;

  if (supabase) {
    const { error } = await supabase.from("company_inquiries").insert({
      name: body.name.trim(),
      affiliation: body.affiliation.trim(),
      position: body.position?.trim() || null,
      phone: body.phone?.trim() || null,
      email: body.email.trim(),
      type: body.type.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      agreed: body.agree,
    });
    if (error) {
      console.error("[inquiry] Supabase 저장 실패", error.message);
      return NextResponse.json({ ok: false, message: "접수 중 문제가 발생했습니다." }, { status: 502 });
    }
    // 이미 저장된 문의이므로 알림 전달 실패는 접수 실패로 보지 않습니다.
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, website: undefined, receivedAt: new Date().toISOString() }),
      }).catch((e) => console.error("[inquiry] Webhook 전달 실패", e));
    }
    return NextResponse.json({ ok: true });
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, website: undefined, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, message: "접수 중 문제가 발생했습니다." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[inquiry] 전달 경로 미설정 — 개발 환경에서만 접수 처리합니다.", { ...body, website: undefined });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, message: "현재 온라인 문의 접수를 준비하고 있습니다. 다른 연락 방법을 이용해 주세요." },
    { status: 503 },
  );
}
