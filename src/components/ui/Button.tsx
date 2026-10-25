import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-light" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-700",
  secondary: "border border-ink/15 bg-white text-ink hover:border-ink",
  "outline-light": "border border-white/25 text-white hover:border-white hover:bg-white/5",
  ghost: "text-ink hover:text-brand px-0",
  inverse: "bg-white text-ink hover:bg-brand-50",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: "arrow" | "external" | "none";
  className?: string;
};

export function Button({ href, children, variant = "primary", icon = "arrow", className = "" }: ButtonProps) {
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-3 px-7 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon !== "none" && (
        <Icon
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:translate-x-1"
          strokeWidth={2}
        />
      )}
    </Link>
  );
}
