"use client";

import { Award, Briefcase, LayoutDashboard, Megaphone, MessageSquareText, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/notices", label: "공지사항", icon: Megaphone },
  { href: "/admin/press", label: "보도자료", icon: Newspaper },
  { href: "/admin/projects", label: "사업실적", icon: Briefcase },
  { href: "/admin/certifications", label: "인증/특허", icon: Award },
  { href: "/admin/inquiries", label: "문의사항", icon: MessageSquareText },
];

export function AdminNav({ newInquiries }: { newInquiries: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="관리자 메뉴" className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[42px] shrink-0 items-center gap-3 px-3 text-[14px] font-medium transition-colors ${
              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
            {href === "/admin/inquiries" && newInquiries > 0 && (
              <span className="ml-auto bg-red-500 px-1.5 text-[11px] font-bold tabular-nums text-white">{newInquiries}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
