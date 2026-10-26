import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { PRESS_PAGE_SIZE, getPressReleases } from "@/content/press";
import { pageMetadata } from "@/lib/seo";

const PATH = "/press";

export const metadata = pageMetadata({ title: "보도자료", description: "언론에 소개된 ESE의 보도자료입니다.", path: PATH });

const formatDate = (date: string) => date.replaceAll("-", ".");

/** 보도자료 갤러리 — 이미지·제목·작성일, 페이지(?page=)는 URL Query로 처리합니다. */
export default async function PressPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const items = await getPressReleases();
  const totalPages = Math.max(1, Math.ceil(items.length / PRESS_PAGE_SIZE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const rows = items.slice((current - 1) * PRESS_PAGE_SIZE, current * PRESS_PAGE_SIZE);
  const pageHref = (p: number) => (p > 1 ? `${PATH}?page=${p}` : PATH);

  return (
    <>
      <SubpageHero href={PATH} eyebrow="PRESS" title="보도자료" description="언론에 소개된 ESE의 사업과 기술 소식입니다." />
      <SubNav href={PATH} />
      <section className="py-16 md:py-24">
        <div className="container max-w-content">
          <p className="mb-8 border-b border-ink pb-4 text-[15px] text-muted">
            총 <span className="font-semibold text-ink">{items.length.toLocaleString("ko-KR")}</span>건
          </p>

          {rows.length > 0 ? (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((p, i) => (
                <li key={p.id}>
                  <Link href={`${PATH}/${p.id}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden border border-line bg-subtle">
                      <Image
                        src={p.imageUrl}
                        alt=""
                        fill
                        priority={i < 3}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <h2 className="mt-5 line-clamp-2 text-[18px] font-bold leading-[1.45] tracking-[-0.02em] group-hover:text-brand">{p.title}</h2>
                    <time dateTime={p.writtenDate} className="mt-2 block font-en text-[14px] tabular-nums text-muted">
                      {formatDate(p.writtenDate)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border border-line px-6 py-20 text-center text-[16px] text-muted">등록된 보도자료가 없습니다.</p>
          )}

          {totalPages > 1 && (
            <nav aria-label="페이지" className="mt-16 flex items-center justify-center gap-1">
              <PageLink href={pageHref(current - 1)} disabled={current === 1} label="이전 페이지">
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </PageLink>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageLink key={p} href={pageHref(p)} active={p === current} label={`${p}페이지`}>
                  {p}
                </PageLink>
              ))}
              <PageLink href={pageHref(current + 1)} disabled={current === totalPages} label="다음 페이지">
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </PageLink>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

function PageLink({ href, children, label, active, disabled }: { href: string; children: ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  const cls = "inline-flex h-11 min-w-[44px] items-center justify-center px-3 font-en text-[15px] tabular-nums";
  if (disabled) {
    return (
      <span aria-hidden="true" className={`${cls} text-ink/20`}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`${cls} ${active ? "bg-ink font-semibold text-white" : "text-ink/70 hover:text-brand"}`}>
      {children}
    </Link>
  );
}
