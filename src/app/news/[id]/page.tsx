import { BoardDetailPage, boardStaticParams } from "@/components/subpage/BoardPages";
import { getBoardPost } from "@/content/board";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return boardStaticParams("news");
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const found = getBoardPost("news", id);
  if (!found) return {};
  return pageMetadata({ title: found.post.title, description: found.post.body[0] ?? "ESE 소식", path: `/news/${id}` });
}

export default function NewsDetailPage({ params }: Props) {
  return <BoardDetailPage category="news" params={params} />;
}
