import { BoardDetailPage, boardStaticParams } from "@/components/subpage/BoardPages";
import { getBoardPost } from "@/content/board";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// Supabase에 새로 등록한 게시물도 다시 빌드하지 않고 열리도록 60초마다 재검증합니다.
export const revalidate = 60;

export function generateStaticParams() {
  return boardStaticParams("news");
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const found = await getBoardPost("news", id);
  if (!found) return {};
  return pageMetadata({ title: found.post.title, description: found.post.body[0] ?? "ESE 소식", path: `/news/${id}` });
}

export default function NewsDetailPage({ params }: Props) {
  return <BoardDetailPage category="news" params={params} />;
}
