-- =========================================================
-- 보도자료 (company_press) + 이미지 Storage 버킷
-- 전제: public.company_is_admin() (20261026061059_company_admin_auth.sql)
-- 컬럼 설명(comment)은 관리자 페이지 입력 항목 이름과 같습니다.
-- =========================================================

-- 1) 테이블
create table if not exists public.company_press (
  id            bigint generated always as identity primary key,
  title         text not null check (char_length(title) between 1 and 300),
  source_url    text not null check (source_url ~* '^https?://' and char_length(source_url) <= 1000),
  image_path    text not null check (char_length(image_path) between 1 and 500),
  content       text not null check (char_length(content) between 1 and 10000),
  written_date  date not null default current_date,
  author        text check (char_length(author) <= 50),
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.company_press              is '보도자료';
comment on column public.company_press.title        is '제목';
comment on column public.company_press.source_url   is '출처 (기사 원문 외부 링크)';
comment on column public.company_press.image_path   is '이미지 (Storage company-press 버킷 내 경로)';
comment on column public.company_press.content      is '내용';
comment on column public.company_press.written_date is '작성일';
comment on column public.company_press.author       is '작성자';
comment on column public.company_press.published    is '사이트 공개 여부';

create index if not exists company_press_written_idx on public.company_press (written_date desc);

-- 2) 보안(RLS): 방문자는 공개 글만 조회, 관리자는 등록·수정·삭제
alter table public.company_press enable row level security;

drop policy if exists "public can read published press" on public.company_press;
create policy "public can read published press"
  on public.company_press for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admin manages press" on public.company_press;
create policy "admin manages press"
  on public.company_press for all
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

-- 3) 이미지 저장소(Storage 버킷): 누구나 보기, 관리자만 업로드·수정·삭제
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('company-press', 'company-press', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "admin uploads press images" on storage.objects;
create policy "admin uploads press images"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'company-press' and (select public.company_is_admin()));

drop policy if exists "admin updates press images" on storage.objects;
create policy "admin updates press images"
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'company-press' and (select public.company_is_admin()));

drop policy if exists "admin deletes press images" on storage.objects;
create policy "admin deletes press images"
  on storage.objects for delete to anon, authenticated
  using (bucket_id = 'company-press' and (select public.company_is_admin()));

drop policy if exists "admin lists press images" on storage.objects;
create policy "admin lists press images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'company-press' and (select public.company_is_admin()));
