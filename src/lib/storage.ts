/** Supabase Storage 이미지 공통 규칙 — 버킷 설정(file_size_limit, allowed_mime_types)과 맞추세요. */

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const IMAGE_HINT = "JPG·PNG·WEBP·GIF, 최대 5MB";

export const publicImageUrl = (bucket: string, path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
