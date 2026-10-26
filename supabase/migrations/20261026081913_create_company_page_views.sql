-- =========================================================
-- 방문 통계: 페이지뷰 기록 + 관리자용 집계 함수
-- 개인정보 최소화: IP·전체 User-Agent를 저장하지 않고, 익명 방문자 ID(쿠키)만 사용합니다.
-- =========================================================

create table if not exists public.company_page_views (
  id             bigint generated always as identity primary key,
  visitor_id     uuid not null,
  path           text not null check (char_length(path) between 1 and 300),
  is_entry       boolean not null default false,
  referrer_host  text check (char_length(referrer_host) <= 200),
  device         text not null check (device in ('mobile', 'tablet', 'desktop')),
  browser        text check (char_length(browser) <= 30),
  created_at     timestamptz not null default now()
);

comment on table  public.company_page_views               is '홈페이지 방문 기록 (페이지뷰)';
comment on column public.company_page_views.visitor_id    is '익명 방문자 ID (쿠키)';
comment on column public.company_page_views.path          is '방문 페이지 경로';
comment on column public.company_page_views.is_entry      is '방문(세션)의 첫 페이지 여부';
comment on column public.company_page_views.referrer_host is '유입 경로 (외부 사이트 도메인, 없으면 직접 방문)';
comment on column public.company_page_views.device        is '기기 (mobile / tablet / desktop)';
comment on column public.company_page_views.browser       is '브라우저';

create index if not exists company_page_views_created_idx on public.company_page_views (created_at desc);

alter table public.company_page_views enable row level security;

-- 방문자는 기록만 가능(조회 불가), 관리자는 조회·삭제
drop policy if exists "visitors can record page views" on public.company_page_views;
create policy "visitors can record page views"
  on public.company_page_views for insert
  to anon, authenticated
  with check (path not like '/admin%');

drop policy if exists "admin reads page views" on public.company_page_views;
create policy "admin reads page views"
  on public.company_page_views for select
  to anon, authenticated
  using ((select public.company_is_admin()));

drop policy if exists "admin deletes page views" on public.company_page_views;
create policy "admin deletes page views"
  on public.company_page_views for delete
  to anon, authenticated
  using ((select public.company_is_admin()));

-- 관리자 대시보드용 집계 (최근 p_days일, 한국 시간 기준)
create or replace function public.company_visit_stats(p_days integer default 7)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_days  integer := least(greatest(coalesce(p_days, 7), 1), 365);
  v_from  timestamptz := (date_trunc('day', now() at time zone 'Asia/Seoul') - make_interval(days => v_days - 1)) at time zone 'Asia/Seoul';
  v_today timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
begin
  if not public.company_is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  return (
    with v as (select * from company_page_views where created_at >= v_from)
    select jsonb_build_object(
      'days', v_days,
      'page_views', (select count(*) from v),
      'visitors', (select count(distinct visitor_id) from v),
      'visits', (select count(*) from v where is_entry),
      'today_visitors', (select count(distinct visitor_id) from v where created_at >= v_today),
      'daily', (
        select coalesce(jsonb_agg(jsonb_build_object('date', d::date, 'visitors', coalesce(x.visitors, 0), 'page_views', coalesce(x.page_views, 0)) order by d), '[]'::jsonb)
        from generate_series((v_from at time zone 'Asia/Seoul')::date, (now() at time zone 'Asia/Seoul')::date, interval '1 day') d
        left join (
          select (created_at at time zone 'Asia/Seoul')::date as day, count(distinct visitor_id) as visitors, count(*) as page_views
          from v group by 1
        ) x on x.day = d::date
      ),
      'devices', (
        select coalesce(jsonb_agg(jsonb_build_object('device', device, 'visitors', n) order by n desc), '[]'::jsonb)
        from (select device, count(distinct visitor_id) as n from v group by device) t
      ),
      'referrers', (
        select coalesce(jsonb_agg(jsonb_build_object('source', source, 'visits', n) order by n desc), '[]'::jsonb)
        from (
          select coalesce(referrer_host, '직접 방문') as source, count(*) as n
          from v where is_entry group by 1 order by 2 desc limit 8
        ) t
      ),
      'pages', (
        select coalesce(jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc), '[]'::jsonb)
        from (select path, count(*) as n from v group by path order by 2 desc limit 8) t
      )
    )
  );
end;
$$;

revoke all on function public.company_visit_stats(integer) from public;
grant execute on function public.company_visit_stats(integer) to anon, authenticated;
