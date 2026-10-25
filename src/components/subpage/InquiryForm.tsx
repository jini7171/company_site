"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

const TYPES = ["사업 문의", "솔루션 문의", "기술 협력", "해외 파트너십", "기타"];

type Status = { state: "idle" } | { state: "sending" } | { state: "done" } | { state: "error"; message: string };

const inputCls =
  "mt-2 block w-full border border-line bg-white px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none focus-visible:outline-none";

export function InquiryForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, agree: data.agree === "on" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message ?? "접수 중 문제가 발생했습니다.");
      form.reset();
      setStatus({ state: "done" });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "접수 중 문제가 발생했습니다." });
    }
  }

  if (status.state === "done") {
    return (
      <div className="flex flex-col items-start gap-5 border border-line bg-white p-10" role="status">
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-brand" />
        <h3 className="text-[24px] font-bold tracking-[-0.02em]">문의가 접수되었습니다</h3>
        <p className="text-[16px] leading-[1.7] text-muted">담당자가 내용을 확인한 뒤 남겨주신 연락처로 회신드리겠습니다.</p>
        <button type="button" onClick={() => setStatus({ state: "idle" })} className="min-h-[44px] text-[15px] font-semibold text-brand">
          새 문의 작성하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <FieldGroup legend="문의사항">
        <Field label="소속" required>
          <input name="affiliation" required autoComplete="organization" placeholder="기관·회사명 / 부서" className={inputCls} />
        </Field>
        <Field label="직급">
          <input name="position" autoComplete="organization-title" placeholder="예) 주무관, 팀장" className={inputCls} />
        </Field>
        <Field label="이름" required>
          <input name="name" required autoComplete="name" className={inputCls} />
        </Field>
        <Field label="연락처">
          <input name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <Field label="문의 유형" required>
          <select name="type" required defaultValue="" className={inputCls}>
            <option value="" disabled>
              선택해 주세요
            </option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="제목" required wide>
          <input name="subject" required maxLength={120} className={inputCls} />
        </Field>
        <Field label="문의 내용" required wide>
          <textarea
            name="message"
            required
            rows={8}
            className={`${inputCls} resize-y`}
            placeholder="사업 개요, 일정, 궁금한 점 등을 자유롭게 적어주세요."
          />
        </Field>
      </FieldGroup>

      {/* Honeypot (자동 입력 방지) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="space-y-6">
        <label className="flex min-h-[44px] items-start gap-3">
          <input name="agree" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-brand" />
          <span className="text-[15px] leading-[1.6] text-ink/80">
            <span className="text-brand">[필수]</span> 문의 회신을 위한 개인정보 수집·이용에 동의합니다.{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-brand">
              개인정보취급방침 보기
            </Link>
          </span>
        </label>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <button
            type="submit"
            disabled={status.state === "sending"}
            className="group inline-flex min-h-[56px] items-center justify-center gap-3 bg-brand px-10 text-[16px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {status.state === "sending" ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
            문의 보내기
          </button>
          {status.state === "error" && (
            <p role="alert" className="text-[15px] text-red-600">
              {status.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function FieldGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="w-full border-b border-ink pb-3 text-[17px] font-bold">{legend}</legend>
      <div className="mt-6 grid gap-6 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="text-[14px] font-semibold">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      {children}
    </label>
  );
}
