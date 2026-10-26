import Link from "next/link";
import type { ReactNode } from "react";
import { IMAGE_HINT, IMAGE_TYPES } from "@/lib/storage";

/** 관리자 화면 공통 UI */

export const inputCls =
  "w-full border border-line-strong bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

export const primaryBtn =
  "inline-flex min-h-[42px] items-center justify-center gap-2 bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700";

export const secondaryBtn =
  "inline-flex min-h-[42px] items-center justify-center gap-2 border border-line-strong bg-white px-5 text-[14px] font-semibold text-ink transition-colors hover:border-ink";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.03em]">{title}</h1>
        {description && <p className="mt-1 text-[14px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="border border-line bg-white">
      {title && (
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[16px] font-bold tracking-[-0.02em]">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink/80">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex min-h-[40px] items-center gap-2 text-[14px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand" />
      {label}
    </label>
  );
}

/** 이미지 업로드 — 수정 중이면 현재 이미지를 보여주고, 새 파일을 고를 때만 교체합니다. */
export function ImageField({ currentUrl, previewCls = "aspect-[16/10] w-full" }: { currentUrl?: string; previewCls?: string }) {
  return (
    <Field label="이미지" required={!currentUrl} hint={currentUrl ? `새 파일을 선택하면 기존 이미지를 교체합니다. (${IMAGE_HINT})` : IMAGE_HINT}>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- 현재 이미지 미리보기
        <img src={currentUrl} alt="현재 이미지" className={`mb-2 border border-line bg-subtle object-contain ${previewCls}`} />
      )}
      <input
        name="image"
        type="file"
        required={!currentUrl}
        accept={IMAGE_TYPES.join(",")}
        className="block w-full text-[14px] file:mr-3 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-white"
      />
    </Field>
  );
}

export function Badge({ children, tone = "bg-subtle text-ink/70 border-line" }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex items-center border px-2 py-0.5 text-[12px] font-semibold ${tone}`}>{children}</span>;
}

const MESSAGES = {
  saved: { text: "저장되었습니다.", tone: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  deleted: { text: "삭제되었습니다.", tone: "border-line bg-subtle text-ink" },
  error: { text: "처리 중 문제가 발생했습니다. 입력값을 확인하고 다시 시도해 주세요.", tone: "border-red-200 bg-red-50 text-red-800" },
  in_use: { text: "이 분류를 쓰는 글이 있어 삭제할 수 없습니다. 글의 분류를 먼저 바꿔 주세요.", tone: "border-amber-200 bg-amber-50 text-amber-800" },
  duplicate: { text: "같은 이름의 분류가 이미 있습니다.", tone: "border-amber-200 bg-amber-50 text-amber-800" },
};

export function ResultBanner({ msg }: { msg?: string }) {
  const m = MESSAGES[msg as keyof typeof MESSAGES];
  if (!m) return null;
  return (
    <p role="status" className={`mb-6 border px-4 py-3 text-[14px] font-medium ${m.tone}`}>
      {m.text}
    </p>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-[14px] text-muted">
        {children}
      </td>
    </tr>
  );
}

export const th = "whitespace-nowrap border-b border-line bg-subtle px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.04em] text-muted";
export const td = "border-b border-line px-4 py-3 align-top text-[14px]";

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand hover:underline">
      {children}
    </Link>
  );
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" });
