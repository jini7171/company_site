-- =========================================================
-- 인증/특허 분류를 테이블로 관리 (관리자 페이지에서 추가·이름 변경·순서·삭제)
-- 분류 이름을 바꾸면 기존 인증/특허 글의 분류도 함께 바뀝니다(on update cascade).
-- 글이 남아 있는 분류는 삭제할 수 없습니다(on delete restrict).
-- =========================================================

create table if not exists public.company_certification_categories (
  name        text primary key check (char_length(btrim(name)) between 1 and 30),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

comment on table  public.company_certification_categories            is '인증/특허 분류';
comment on column public.company_certification_categories.name       is '분류 이름';
comment on column public.company_certification_categories.sort_order is '표시 순서 (작을수록 앞)';

insert into public.company_certification_categories (name, sort_order)
values ('지식재산권', 1), ('인허가', 2), ('수상', 3)
on conflict (name) do nothing;

-- 고정 목록(check) 대신 분류 테이블을 참조합니다.
alter table public.company_certifications drop constraint if exists company_certifications_category_check;
alter table public.company_certifications drop constraint if exists company_certifications_category_fkey;
alter table public.company_certifications
  add constraint company_certifications_category_fkey
  foreign key (category) references public.company_certification_categories (name)
  on update cascade on delete restrict;

alter table public.company_certification_categories enable row level security;

drop policy if exists "public can read certification categories" on public.company_certification_categories;
create policy "public can read certification categories"
  on public.company_certification_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "admin manages certification categories" on public.company_certification_categories;
create policy "admin manages certification categories"
  on public.company_certification_categories for all
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));
