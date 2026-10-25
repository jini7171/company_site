import type { Config } from "tailwindcss";

/**
 * ESE Design Tokens
 * - Visual concept: White Editorial Tech
 * - Brand balance: Trust 60 / Technology Innovation 40
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        canvas: "#FFFFFF",
        subtle: "#F6F8FB",
        ink: {
          DEFAULT: "#0B1220",
          800: "#1B2436",
          700: "#344054",
        },
        muted: "#667085",
        line: {
          DEFAULT: "#E5E7EB",
          strong: "#D0D5DD",
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE7FD",
          200: "#B6CDFB",
          400: "#4F84EC",
          DEFAULT: "#185ADB",
          600: "#134BBA",
          700: "#103E99",
          900: "#0A2766",
        },
        cyan: {
          DEFAULT: "#0EA5C6",
          100: "#D5F3F9",
        },
        night: {
          DEFAULT: "#0B1220",
          800: "#111A2E",
          700: "#1A2540",
          line: "#243150",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
        kr: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "system-ui",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
        en: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.16em" }],
        "display-xl": ["clamp(3.25rem, 8.2vw, 7.25rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "headline-kr": ["clamp(2.125rem, 4.6vw, 4.25rem)", { lineHeight: "1.18", letterSpacing: "-0.035em" }],
        "section-kr": ["clamp(1.875rem, 3.6vw, 3.25rem)", { lineHeight: "1.22", letterSpacing: "-0.03em" }],
        metric: ["clamp(3.5rem, 7vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.05em" }],
      },
      maxWidth: {
        content: "1280px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "line-rise": {
          from: { transform: "translateY(105%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        draw: {
          from: { strokeDashoffset: "var(--dash, 400)" },
          to: { strokeDashoffset: "0" },
        },
        flow: {
          to: { strokeDashoffset: "-120" },
        },
        "grid-drift": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-80px,0,0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.35)" },
        },
      },
      animation: {
        "line-rise": "line-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        draw: "draw 2.4s cubic-bezier(0.65, 0, 0.35, 1) both",
        flow: "flow 6s linear infinite",
        "grid-drift": "grid-drift 60s linear infinite",
        pulse: "pulse 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
