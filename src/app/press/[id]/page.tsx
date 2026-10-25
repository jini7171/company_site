import { BoardDetailPage, boardStaticParams } from "@/components/subpage/BoardPages";
import { getBoardPost } from "@/content/board";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return boardStaticParams("press");
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const found = getBoardPost("press", id);
  if (!found) return {};
  return pageMetadata({ title: found.post.title, description: found.post.body[0] ?? "ESE 보도자료", path: `/press/${id}` });
}

export default function PressDetailPage({ params }: Props) {
  return <BoardDetailPage category="press" params={params} />;
}
