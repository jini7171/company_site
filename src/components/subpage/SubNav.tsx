import Link from "next/link";
import { getNavContext } from "@/lib/nav";

/** 같은 메뉴 그룹의 하위 페이지 Tab — Header 아래에 고정됩니다. */
export function SubNav({ href }: { href: string }) {
  const nav = getNavContext(href);
  if (!nav) return null;

  return (
    <nav
      aria-label={`${nav.group.label} 하위 메뉴`}
      className="sticky top-[var(--header-h)] z-30 border-b border-line bg-white/95 backdrop-blur-md"
    >
      <div className="container max-w-content">
        <ul className="-mx-1 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.group.links.map((link) => {
            const active = link.href === href;
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-[56px] items-center whitespace-nowrap px-4 text-[15px] transition-colors ${
                    active ? "font-semibold text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 bottom-0 h-[2px] bg-brand transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
