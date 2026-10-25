import { type BoardSearchParams, BoardListPage } from "@/components/subpage/BoardPages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "ESE 소식", description: "ESE의 새로운 소식을 전합니다.", path: "/news" });

export default function NewsPage({ searchParams }: { searchParams: BoardSearchParams }) {
  return <BoardListPage category="news" searchParams={searchParams} />;
}
