import Link from "next/link";
import { legalLinks, mainNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <div className="container max-w-content">
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-muted">
              {siteConfig.foundedYear}년부터 축적해온 경험으로
              <br />
              더 스마트한 도시를 만듭니다.
            </p>
          </div>

          <nav aria-label="사이트맵" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {mainNavigation.map((group) => (
              <div key={group.key}>
                <p className="font-en text-[13px] font-semibold tracking-[0.02em] text-ink">{group.label}</p>
                <ul className="mt-4 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[32px] items-center text-[14px] text-muted transition-colors hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-8 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
          <p className="font-en">
            © {year} {siteConfig.legalName} All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex min-h-[44px] items-center transition-colors hover:text-brand ${
                    link.emphasis ? "font-semibold text-ink" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
