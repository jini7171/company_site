import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";

/** 로그인한 관리자만 들어오는 영역 — 세션이 없거나 만료되면 /admin(로그인)으로 보냅니다. */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { db } = await requireAdmin();
  const { count } = await db.from("company_inquiries").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <div className="lg:grid lg:min-h-svh lg:grid-cols-[232px_1fr]">
      <aside className="flex flex-col gap-4 bg-night p-4 text-white lg:sticky lg:top-0 lg:h-svh lg:gap-8 lg:p-5">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin/dashboard" className="block">
            <span className="font-en text-[20px] font-bold tracking-[-0.03em]">ESE</span>
            <span className="ml-2 font-en text-[12px] font-semibold uppercase tracking-[0.12em] text-cyan">Admin</span>
          </Link>
        </div>
        <AdminNav newInquiries={count ?? 0} />
        <div className="mt-auto hidden space-y-1 border-t border-white/10 pt-4 lg:block">
          <Link href="/" target="_blank" className="flex min-h-[40px] items-center gap-3 px-3 text-[13px] text-white/60 hover:text-white">
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            사이트 보기
          </Link>
          <form action={logout}>
            <button type="submit" className="flex min-h-[40px] w-full items-center gap-3 px-3 text-[13px] text-white/60 hover:text-white">
              <LogOut aria-hidden="true" className="h-4 w-4" />
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        {/* 모바일에서는 사이드바 하단 메뉴 대신 상단에 표시 */}
        <div className="flex justify-end gap-2 border-b border-line bg-white px-4 py-2 lg:hidden">
          <Link href="/" target="_blank" className="px-3 py-2 text-[13px] text-muted">
            사이트 보기
          </Link>
          <form action={logout}>
            <button type="submit" className="px-3 py-2 text-[13px] text-muted">
              로그아웃
            </button>
          </form>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
