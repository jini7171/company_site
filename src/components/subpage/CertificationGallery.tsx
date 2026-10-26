"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Certification } from "@/content/types";

const formatDate = (date: string) => date.replaceAll("-", ".");

/** 인증·특허 이미지 게시판 — 분류 Tab으로 거르고, 카드를 누르면 크게 봅니다. */
export function CertificationGallery({ items, categories }: { items: Certification[]; categories: string[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Certification | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const visible = category ? items.filter((c) => c.category === category) : items;
  const tabs = [null, ...categories];

  return (
    <>
      <div role="tablist" aria-label="분류" className="mb-10 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = tab ? items.filter((c) => c.category === tab).length : items.length;
          const active = tab === category;
          return (
            <button
              key={tab ?? "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(tab)}
              className={`inline-flex min-h-[44px] items-center gap-2 border px-5 text-[15px] transition-colors ${
                active ? "border-ink bg-ink font-semibold text-white" : "border-line bg-white text-ink/70 hover:border-ink"
              }`}
            >
              {tab ?? "전체"}
              <span className={`font-en text-[13px] tabular-nums ${active ? "text-white/60" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setSelected(c)} className="group block w-full text-left">
                <div className="relative aspect-[3/4] overflow-hidden border border-line bg-subtle transition-colors group-hover:border-brand">
                  <Image
                    src={c.imageUrl}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[13px] font-semibold text-brand">{c.category}</p>
                <p className="mt-1 text-[16px] font-semibold leading-[1.45] tracking-[-0.02em] group-hover:text-brand">{c.title}</p>
                <p className="mt-1 font-en text-[13px] tabular-nums text-muted">{formatDate(c.writtenDate)}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-line bg-white px-6 py-16 text-center text-[15px] text-muted">
          {items.length > 0 ? "해당 분류에 등록된 항목이 없습니다." : "인증·특허 현황을 정리하고 있습니다."}
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-label={selected?.title}
        onClose={() => setSelected(null)}
        onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        className="w-[min(92vw,960px)] max-w-none bg-white p-0 backdrop:bg-night/80"
      >
        {selected && (
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <div className="relative aspect-[3/4] bg-subtle md:aspect-auto md:min-h-[70vh]">
              <Image src={selected.imageUrl} alt={selected.title} fill sizes="(min-width: 768px) 55vw, 92vw" className="object-contain p-6" />
            </div>
            <div className="flex flex-col p-7 md:p-9">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="닫기"
                className="-mr-2 -mt-2 ml-auto inline-flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
              <p className="text-[13px] font-semibold text-brand">{selected.category}</p>
              <h3 className="mt-2 text-[24px] font-bold leading-[1.35] tracking-[-0.03em]">{selected.title}</h3>
              <p className="mt-2 font-en text-[14px] tabular-nums text-muted">{formatDate(selected.writtenDate)}</p>
              {selected.content && <p className="mt-6 whitespace-pre-line border-t border-line pt-6 text-[15px] leading-[1.75] text-ink/80">{selected.content}</p>}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
