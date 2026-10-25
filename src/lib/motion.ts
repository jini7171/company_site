import type { CSSProperties } from "react";

/** Scroll Reveal 순차 등장 Delay */
export const revealDelay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;
