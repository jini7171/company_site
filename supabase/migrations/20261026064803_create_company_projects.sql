-- =========================================================
-- 사업실적 (company_projects) + 이미지 Storage 버킷
-- 전제: public.company_is_admin() (20261026061059_company_admin_auth.sql)
-- =========================================================

-- 1) 테이블
create table if not exists public.company_projects (
  id            bigint generated always as identity primary key,
  category      text not null
                check (category in ('스마트시티', '재난안전', '통합관제센터', '해외스마트시티', '국토공간정보', '도로교통')),
  title         text not null check (char_length(title) between 1 and 300),
  content       text check (char_length(content) <= 5000),
  image_path    text not null check (char_length(image_path) between 1 and 500),
  start_date    date,
  end_date      date,
  written_date  date,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint company_projects_period_check
    check (end_date is null or start_date is null or end_date >= start_date)
);

comment on table  public.company_projects              is '사업실적';
comment on column public.company_projects.category     is '프로젝트 분류';
comment on column public.company_projects.title        is '프로젝트명';
comment on column public.company_projects.content      is '내용';
comment on column public.company_projects.image_path   is '이미지 (Storage company-projects 버킷 내 경로)';
comment on column public.company_projects.start_date   is '구축기간 시작';
comment on column public.company_projects.end_date     is '구축기간 종료';
comment on column public.company_projects.written_date is '작성일';
comment on column public.company_projects.published    is '사이트 공개 여부';

create index if not exists company_projects_category_idx on public.company_projects (category);

-- 2) 보안(RLS): 방문자는 공개 글만 조회, 관리자는 등록·수정·삭제
alter table public.company_projects enable row level security;

drop policy if exists "public can read published projects" on public.company_projects;
create policy "public can read published projects"
  on public.company_projects for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admin manages projects" on public.company_projects;
create policy "admin manages projects"
  on public.company_projects for all
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

-- 3) 이미지 저장소(Storage 버킷): 누구나 보기, 관리자만 업로드·수정·삭제
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('company-projects', 'company-projects', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "admin uploads project images" on storage.objects;
create policy "admin uploads project images"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'company-projects' and (select public.company_is_admin()));

drop policy if exists "admin updates project images" on storage.objects;
create policy "admin updates project images"
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'company-projects' and (select public.company_is_admin()));

drop policy if exists "admin deletes project images" on storage.objects;
create policy "admin deletes project images"
  on storage.objects for delete to anon, authenticated
  using (bucket_id = 'company-projects' and (select public.company_is_admin()));

drop policy if exists "admin lists project images" on storage.objects;
create policy "admin lists project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'company-projects' and (select public.company_is_admin()));
