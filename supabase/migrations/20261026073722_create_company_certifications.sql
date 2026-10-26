-- =========================================================
-- 인증/특허 (company_certifications) + 이미지 Storage 버킷
-- 전제: public.company_is_admin() (20261026061059_company_admin_auth.sql)
-- =========================================================

-- 1) 테이블
create table if not exists public.company_certifications (
  id            bigint generated always as identity primary key,
  category      text not null check (category in ('지식재산권', '인허가', '수상')),
  title         text not null check (char_length(title) between 1 and 300),
  content       text check (char_length(content) <= 5000),
  image_path    text not null check (char_length(image_path) between 1 and 500),
  written_date  date not null default current_date,
  author        text check (char_length(author) <= 50),
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.company_certifications              is '인증/특허';
comment on column public.company_certifications.category     is '분류';
comment on column public.company_certifications.title        is '제목';
comment on column public.company_certifications.content      is '내용';
comment on column public.company_certifications.image_path   is '이미지 (Storage company-certifications 버킷 내 경로)';
comment on column public.company_certifications.written_date is '작성일';
comment on column public.company_certifications.author       is '작성자';
comment on column public.company_certifications.published    is '사이트 공개 여부';

create index if not exists company_certifications_category_idx on public.company_certifications (category);

-- 2) 보안(RLS): 방문자는 공개 글만 조회, 관리자는 등록·수정·삭제
alter table public.company_certifications enable row level security;

drop policy if exists "public can read published certifications" on public.company_certifications;
create policy "public can read published certifications"
  on public.company_certifications for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admin manages certifications" on public.company_certifications;
create policy "admin manages certifications"
  on public.company_certifications for all
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

-- 3) 이미지 저장소(Storage 버킷): 누구나 보기, 관리자만 업로드·수정·삭제
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('company-certifications', 'company-certifications', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "admin uploads certification images" on storage.objects;
create policy "admin uploads certification images"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'company-certifications' and (select public.company_is_admin()));

drop policy if exists "admin updates certification images" on storage.objects;
create policy "admin updates certification images"
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'company-certifications' and (select public.company_is_admin()));

drop policy if exists "admin deletes certification images" on storage.objects;
create policy "admin deletes certification images"
  on storage.objects for delete to anon, authenticated
  using (bucket_id = 'company-certifications' and (select public.company_is_admin()));

drop policy if exists "admin lists certification images" on storage.objects;
create policy "admin lists certification images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'company-certifications' and (select public.company_is_admin()));
