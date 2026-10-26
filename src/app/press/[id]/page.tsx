import { ArrowUpRight, ChevronDown, ChevronUp, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubNav } from "@/components/subpage/SubNav";
import { getPressRelease, getPressReleases } from "@/content/press";
import type { PressRelease } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// 새로 등록한 기사도 다시 빌드하지 않고 열리도록 60초마다 재검증합니다.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPressReleases()).map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const found = await getPressRelease(Number(id));
  if (!found) return {};
  return pageMetadata({ title: found.item.title, description: found.item.content.slice(0, 120), path: `/press/${id}` });
}

const formatDate = (date: string) => date.replaceAll("-", ".");

/** 보도자료 상세 — 이미지 / 제목·작성일 / 내용 / 출처(원문) / 이전·다음 기사 / 목록 */
export default async function PressDetailPage({ params }: Props) {
  const { id } = await params;
  const found = await getPressRelease(Number(id));
  if (!found) notFound();
  const { item, newer, older } = found;
  const sourceHost = new URL(item.sourceUrl).hostname.replace(/^www\./, "");

  return (
    <>
      <SubNav href="/press" />
      <article className="py-16 md:py-24">
        <div className="container max-w-[960px]">
          <header className="border-b border-line border-t-2 border-t-ink pb-8 pt-10">
            <p className="eyebrow">보도자료</p>
            <h1 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.35] tracking-[-0.03em]">{item.title}</h1>
            <time dateTime={item.writtenDate} className="mt-5 block font-en text-[14px] tabular-nums text-muted">
              {formatDate(item.writtenDate)}
            </time>
          </header>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-line bg-subtle">
            <Image src={item.imageUrl} alt={item.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-contain" />
          </div>

          <div className="space-y-5 py-12 text-[17px] leading-[1.9] text-ink/85">
            {item.content
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
          </div>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-12 flex items-center justify-between gap-4 border border-line bg-subtle px-6 py-5 transition-colors hover:border-brand"
          >
            <span>
              <span className="block text-[13px] font-semibold text-muted">출처</span>
              <span className="mt-1 block text-[15px] font-semibold">{sourceHost}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
              기사 원문 보기
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </a>

          <nav aria-label="이전·다음 기사" className="border-y border-line">
            <AdjacentRow icon="up" label="다음 기사" item={newer} />
            <AdjacentRow icon="down" label="이전 기사" item={older} />
          </nav>

          <div className="mt-10 flex justify-center">
            <Link href="/press" className="inline-flex min-h-[52px] items-center gap-2 border border-ink/15 px-8 text-[15px] font-semibold hover:border-ink">
              <List aria-hidden="true" className="h-4 w-4" />
              목록
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

function AdjacentRow({ icon, label, item }: { icon: "up" | "down"; label: string; item: PressRelease | null }) {
  const Icon = icon === "up" ? ChevronUp : ChevronDown;
  const inner = (
    <>
      <span className="flex w-24 shrink-0 items-center gap-2 text-[14px] font-semibold">
        <Icon aria-hidden="true" className="h-4 w-4" />
        {label}
      </span>
      <span className={`min-w-0 flex-1 truncate text-[15px] ${item ? "" : "text-muted"}`}>{item ? item.title : `${label}가 없습니다.`}</span>
    </>
  );
  return item ? (
    <Link href={`/press/${item.id}`} className="flex min-h-[60px] items-center gap-4 border-b border-line px-2 last:border-b-0 hover:text-brand">
      {inner}
    </Link>
  ) : (
    <div className="flex min-h-[60px] items-center gap-4 border-b border-line px-2 last:border-b-0">{inner}</div>
  );
}
