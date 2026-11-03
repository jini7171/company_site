import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo-ese.png";

/**
 * ESE 공식 로고 (심볼 + ESE + 이에스이(주))
 * 배경이 투명한 PNG라 밝은 배경에서 사용합니다. 크기는 className의 높이(h-*)로 조절합니다.
 */
export function Logo({ className = "h-10", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="ESE 홈으로 이동" className="inline-flex min-h-[44px] shrink-0 items-center">
      <Image src={logo} alt="ESE 이에스이(주)" priority={priority} className={`w-auto ${className}`} />
    </Link>
  );
}
