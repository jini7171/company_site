import { NextResponse } from "next/server";

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
 * TODO: 실제 전달 경로(메일 발송·CRM·Slack 등)를 정한 뒤 INQUIRY_WEBHOOK_URL 환경변수로 연결하세요.
 * 전달 경로가 없는 Production 환경에서는 접수하지 않고 503을 반환해, 문의가 유실되지 않도록 합니다.
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
