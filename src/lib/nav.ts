import { mainNavigation } from "@/content/navigation";

/** 현재 경로가 속한 메뉴 그룹과 링크를 찾습니다. (Breadcrumb·SubNav 공통) */
export function getNavContext(href: string) {
  for (const group of mainNavigation) {
    const link = group.links.find((l) => l.href === href);
    if (link) return { group, link };
  }
  return null;
}

/** Header 메뉴의 현재 위치 표시용 */
export function isInGroup(pathname: string, groupKey: string) {
  const group = mainNavigation.find((g) => g.key === groupKey);
  return !!group?.links.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));
}
