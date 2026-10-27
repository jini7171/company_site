-- =========================================================
-- 게시판 정렬: 게시판별 정렬 방식 + 직접 지정 순서
-- 정렬 방식: date_desc(최신순) / date_asc(오래된순) / manual(직접 지정, sort_order 작은 순)
-- 공지사항은 상단 고정(pinned) 글이 항상 먼저 옵니다.
-- =========================================================

-- 1) 게시판별 정렬 방식
create table if not exists public.company_board_settings (
  board       text primary key check (board in ('news', 'press', 'projects', 'certifications')),
  sort_mode   text not null default 'date_desc' check (sort_mode in ('date_desc', 'date_asc', 'manual')),
  updated_at  timestamptz not null default now()
);

comment on table  public.company_board_settings           is '게시판 설정';
comment on column public.company_board_settings.board     is '게시판 (news 공지사항 / press 보도자료 / projects 사업실적 / certifications 인증·특허)';
comment on column public.company_board_settings.sort_mode is '정렬 방식 (date_desc 최신순 / date_asc 오래된순 / manual 직접 지정)';

insert into public.company_board_settings (board) values ('news'), ('press'), ('projects'), ('certifications')
on conflict (board) do nothing;

alter table public.company_board_settings enable row level security;

drop policy if exists "public can read board settings" on public.company_board_settings;
create policy "public can read board settings"
  on public.company_board_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "admin updates board settings" on public.company_board_settings;
create policy "admin updates board settings"
  on public.company_board_settings for update
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

-- 2) 직접 지정 순서 칸 (작을수록 앞)
alter table public.company_board_posts    add column if not exists sort_order integer not null default 0;
alter table public.company_press          add column if not exists sort_order integer not null default 0;
alter table public.company_projects       add column if not exists sort_order integer not null default 0;
alter table public.company_certifications add column if not exists sort_order integer not null default 0;

comment on column public.company_board_posts.sort_order    is '표시 순서 (직접 지정, 작을수록 앞)';
comment on column public.company_press.sort_order          is '표시 순서 (직접 지정, 작을수록 앞)';
comment on column public.company_projects.sort_order       is '표시 순서 (직접 지정, 작을수록 앞)';
comment on column public.company_certifications.sort_order is '표시 순서 (직접 지정, 작을수록 앞)';

-- 기존 글은 지금 화면에 보이는 순서 그대로 번호를 매깁니다.
update public.company_board_posts t set sort_order = o.rn
from (select id, row_number() over (order by pinned desc, date desc, created_at desc) as rn from public.company_board_posts) o
where t.id = o.id;

update public.company_press t set sort_order = o.rn
from (select id, row_number() over (order by written_date desc, created_at desc) as rn from public.company_press) o
where t.id = o.id;

update public.company_projects t set sort_order = o.rn
from (select id, row_number() over (order by written_date desc nulls last, created_at desc) as rn from public.company_projects) o
where t.id = o.id;

update public.company_certifications t set sort_order = o.rn
from (select id, row_number() over (order by written_date desc, created_at desc) as rn from public.company_certifications) o
where t.id = o.id;

-- 3) 순서 한 번에 저장 (관리자 전용): p_ids 배열 순서대로 sort_order = 1, 2, 3 …
create or replace function public.company_set_order(p_board text, p_ids text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_table text;
begin
  if not public.company_is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  v_table := case p_board
    when 'news' then 'company_board_posts'
    when 'press' then 'company_press'
    when 'projects' then 'company_projects'
    when 'certifications' then 'company_certifications'
  end;
  if v_table is null then
    raise exception 'unknown board: %', p_board;
  end if;

  execute format(
    'update %I t set sort_order = o.ord::integer from unnest($1) with ordinality as o(id, ord) where t.id::text = o.id',
    v_table
  ) using p_ids;
end;
$$;

revoke all on function public.company_set_order(text, text[]) from public;
grant execute on function public.company_set_order(text, text[]) to anon, authenticated;
