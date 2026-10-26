-- =========================================================
-- ESE 회사 사이트: 관리자 로그인 + 관리자 권한(RLS)
-- 로그인 토큰은 요청 헤더 x-admin-token 으로 전달되고, company_is_admin() 이 검사합니다.
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

-- 관리자 계정·세션 (정책 없음: SECURITY DEFINER 함수로만 접근)
create table if not exists public.company_admin_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);
create table if not exists public.company_admin_sessions (
  token      uuid primary key default gen_random_uuid(),
  admin_id   uuid not null references public.company_admin_users (id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '12 hours')
);
create index if not exists company_admin_sessions_admin_idx on public.company_admin_sessions (admin_id);
alter table public.company_admin_users enable row level security;
alter table public.company_admin_sessions enable row level security;

-- 로그인: 성공 시 세션 토큰, 실패 시 null
create or replace function public.company_admin_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin uuid;
  v_token uuid;
begin
  select id into v_admin
  from company_admin_users
  where username = p_username and password_hash = crypt(p_password, password_hash);

  if v_admin is null then
    perform pg_sleep(1); -- 무차별 대입 완화
    return null;
  end if;

  delete from company_admin_sessions where expires_at < now();
  insert into company_admin_sessions (admin_id) values (v_admin) returning token into v_token;
  return v_token;
end;
$$;

create or replace function public.company_admin_logout(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from company_admin_sessions where token = p_token;
$$;

-- 요청 헤더 x-admin-token 의 세션이 유효한지 (RLS 정책에서 사용)
create or replace function public.company_is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_token uuid;
begin
  begin
    v_token := nullif(current_setting('request.headers', true)::json ->> 'x-admin-token', '')::uuid;
  exception when others then
    return false;
  end;
  if v_token is null then
    return false;
  end if;
  return exists (select 1 from company_admin_sessions where token = v_token and expires_at > now());
end;
$$;

revoke all on function public.company_admin_login(text, text) from public;
revoke all on function public.company_admin_logout(uuid) from public;
revoke all on function public.company_is_admin() from public;
grant execute on function public.company_admin_login(text, text) to anon, authenticated;
grant execute on function public.company_admin_logout(uuid) to anon, authenticated;
grant execute on function public.company_is_admin() to anon, authenticated;

-- 관리자 계정은 비밀번호가 Git에 남지 않도록 이 파일에서 만들지 않습니다.
-- 새 환경에서는 SQL Editor에서 아래처럼 직접 실행하세요. ('<비밀번호>'를 바꿔서)
--   insert into public.company_admin_users (username, password_hash)
--   values ('admin', extensions.crypt('<비밀번호>', extensions.gen_salt('bf')));

-- 게시판: 관리자는 비공개 글 포함 전체 관리
drop policy if exists "admin manages board posts" on public.company_board_posts;
create policy "admin manages board posts"
  on public.company_board_posts for all
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

-- 문의: 답변 처리 칸 + 방문자 접수 / 관리자 조회·수정·삭제
alter table public.company_inquiries
  add column if not exists admin_memo text check (char_length(admin_memo) <= 5000),
  add column if not exists answered_at timestamptz;

drop policy if exists "visitors can submit company inquiries" on public.company_inquiries;
create policy "visitors can submit company inquiries"
  on public.company_inquiries for insert
  to anon, authenticated
  with check (status = 'new' and admin_memo is null and answered_at is null);

drop policy if exists "admin reads inquiries" on public.company_inquiries;
create policy "admin reads inquiries"
  on public.company_inquiries for select
  to anon, authenticated
  using ((select public.company_is_admin()));

drop policy if exists "admin updates inquiries" on public.company_inquiries;
create policy "admin updates inquiries"
  on public.company_inquiries for update
  to anon, authenticated
  using ((select public.company_is_admin()))
  with check ((select public.company_is_admin()));

drop policy if exists "admin deletes inquiries" on public.company_inquiries;
create policy "admin deletes inquiries"
  on public.company_inquiries for delete
  to anon, authenticated
  using ((select public.company_is_admin()));
