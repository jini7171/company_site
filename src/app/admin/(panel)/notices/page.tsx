import { type ManagerSearchParams, PostManager } from "@/components/admin/PostManager";

export default function AdminNoticesPage({ searchParams }: { searchParams: ManagerSearchParams }) {
  return <PostManager category="news" searchParams={searchParams} />;
}
