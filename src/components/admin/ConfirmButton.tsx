"use client";

import type { ReactNode } from "react";

/** 삭제처럼 되돌릴 수 없는 Submit 전에 한 번 더 확인합니다. */
export function ConfirmButton({ message, children, className = "" }: { message: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
