import { type BoardSearchParams, BoardListPage } from "@/components/subpage/BoardPages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "보도자료", description: "언론에 소개된 ESE의 보도자료입니다.", path: "/press" });

export default function PressPage({ searchParams }: { searchParams: BoardSearchParams }) {
  return <BoardListPage category="press" searchParams={searchParams} />;
}
