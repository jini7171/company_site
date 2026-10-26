import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 상위 폴더의 다른 프로젝트 lockfile을 workspace root로 오인하지 않도록 고정합니다.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // 사업실적 이미지 (Supabase Storage 공개 버킷)
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : []),
    ],
  },
  experimental: {
    // 관리자 사업실적 이미지 업로드(최대 5MB)를 Server Action으로 받습니다.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
